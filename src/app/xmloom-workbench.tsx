'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';
import { ClipboardIcon, FileCodeIcon, PlusIcon, RotateCcwIcon, Trash2Icon } from 'lucide-react';
import { Badge } from '@/components/shadcn/badge';
import { Button } from '@/components/shadcn/button';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/shadcn/card';
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/shadcn/empty';
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldTitle,
} from '@/components/shadcn/field';
import { Input } from '@/components/shadcn/input';
import { ScrollArea } from '@/components/shadcn/scroll-area';
import { Textarea } from '@/components/shadcn/textarea';
import { ToggleGroup, ToggleGroupItem } from '@/components/shadcn/toggle-group';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/shadcn/tooltip';
import { useLocaleController, type Locale } from '@/i18n/i18n-provider';
import { cn } from '@/utils/shadcn';
import { buildXmlDocument, getFallbackTagName, isValidXmlTagName } from '@/utils/xml-conversion';

type WorkbenchField = {
  id: string;
  name?: string;
  content?: string;
  children: WorkbenchField[];
};

type EditableFieldKey = 'name' | 'content';

const INITIAL_FIELDS: WorkbenchField[] = [
  {
    id: 'field-1',
    name: '',
    content: '',
    children: [],
  },
];

function createField(id: string): WorkbenchField {
  return {
    id,
    name: '',
    content: '',
    children: [],
  };
}

function countAllFields(fields: WorkbenchField[]): number {
  return fields.reduce((count, field) => count + 1 + countAllFields(field.children), 0);
}

function updateFieldInTree(
  fields: WorkbenchField[],
  id: string,
  key: EditableFieldKey,
  value: string,
): WorkbenchField[] {
  return fields.map((field) => {
    if (field.id === id) {
      return {
        ...field,
        [key]: value,
      };
    }

    return {
      ...field,
      children: updateFieldInTree(field.children, id, key, value),
    };
  });
}

function addChildToField(fields: WorkbenchField[], parentId: string, child: WorkbenchField): WorkbenchField[] {
  return fields.map((field) => {
    if (field.id === parentId) {
      return {
        ...field,
        children: [...field.children, child],
      };
    }

    return {
      ...field,
      children: addChildToField(field.children, parentId, child),
    };
  });
}

function removeFieldFromTree(fields: WorkbenchField[], id: string): WorkbenchField[] {
  return fields
    .filter((field) => field.id !== id)
    .map((field) => ({
      ...field,
      children: removeFieldFromTree(field.children, id),
    }));
}

export default function XmloomWorkbench() {
  const { locale, setLocale, t } = useLocaleController();
  const [fields, setFields] = useState<WorkbenchField[]>(INITIAL_FIELDS);
  const [nextFieldId, setNextFieldId] = useState(2);
  const fieldRefs = useRef(new Map<string, HTMLDivElement>());
  const pendingScrollFieldIdRef = useRef<string | null>(null);

  const result = useMemo(() => buildXmlDocument(fields), [fields]);
  const totalFields = countAllFields(fields);
  const fallbackCount = result.includedFields.filter((field) => field.usedFallback).length;

  useEffect(() => {
    const fieldId = pendingScrollFieldIdRef.current;

    if (!fieldId) {
      return;
    }

    const fieldElement = fieldRefs.current.get(fieldId);

    if (!fieldElement) {
      return;
    }

    const animationFrame = window.requestAnimationFrame(() => {
      fieldElement.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
      fieldElement.querySelector<HTMLInputElement>('input')?.focus({
        preventScroll: true,
      });
      pendingScrollFieldIdRef.current = null;
    });

    return () => window.cancelAnimationFrame(animationFrame);
  }, [fields]);

  function getNewField() {
    const field = createField(`field-${nextFieldId}`);
    setNextFieldId((currentId) => currentId + 1);

    return field;
  }

  function updateField(id: string, key: EditableFieldKey, value: string) {
    setFields((currentFields) => updateFieldInTree(currentFields, id, key, value));
  }

  function addField() {
    const field = getNewField();

    pendingScrollFieldIdRef.current = field.id;
    setFields((currentFields) => [...currentFields, field]);
  }

  function addChild(parentId: string) {
    const field = getNewField();

    pendingScrollFieldIdRef.current = field.id;
    setFields((currentFields) => addChildToField(currentFields, parentId, field));
  }

  function removeField(id: string) {
    setFields((currentFields) => removeFieldFromTree(currentFields, id));
  }

  function resetFields() {
    setFields(INITIAL_FIELDS);
    setNextFieldId(2);
  }

  function changeLocale(value: string) {
    if (value === 'en' || value === 'ko') {
      setLocale(value as Locale);
    }
  }

  async function copyXml() {
    if (!result.xml) {
      return;
    }

    try {
      await navigator.clipboard.writeText(result.xml);
      toast.success(t('copySuccess'));
    } catch {
      toast.error(t('copyError'));
    }
  }

  function renderField(field: WorkbenchField, index: number, siblingCount: number, depth: number, path: number[]) {
    const trimmedName = field.name?.trim() ?? '';
    const hasInvalidName = Boolean(trimmedName && !isValidXmlTagName(trimmedName));
    const fallbackTagName = getFallbackTagName(index);
    const childFields = field.children;
    const pathLabel = path.map((position) => position + 1).join('.');
    const canRemove = depth > 0 || siblingCount > 1;

    return (
      <Field
        key={field.id}
        ref={(node) => {
          if (node) {
            fieldRefs.current.set(field.id, node);
          } else {
            fieldRefs.current.delete(field.id);
          }
        }}
        data-invalid={hasInvalidName || undefined}
      >
        <FieldContent
          className={cn('bg-background gap-3 rounded-lg border p-3', depth > 0 && 'border-l-primary/40 border-l-2')}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex min-w-0 flex-col gap-1">
              <FieldTitle>{t('fieldTitle', { index: pathLabel })}</FieldTitle>
              <FieldDescription>
                {t('tagFallback')}: &lt;{fallbackTagName}&gt;
              </FieldDescription>
            </div>

            <div className="flex shrink-0 items-center gap-1">
              <Button type="button" variant="outline" size="sm" onClick={() => addChild(field.id)}>
                <PlusIcon data-icon="inline-start" />
                {t('addChild')}
              </Button>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    aria-label={t('removeFieldAria', { index: pathLabel })}
                    disabled={!canRemove}
                    onClick={() => removeField(field.id)}
                  >
                    <Trash2Icon />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{t('removeField')}</TooltipContent>
              </Tooltip>
            </div>
          </div>

          <Field data-invalid={hasInvalidName || undefined}>
            <FieldLabel htmlFor={`${field.id}-name`}>{t('fieldNameLabel')}</FieldLabel>
            <Input
              id={`${field.id}-name`}
              value={field.name}
              aria-invalid={hasInvalidName || undefined}
              placeholder={t('fieldNamePlaceholder')}
              onChange={(event) => updateField(field.id, 'name', event.target.value)}
            />
            {hasInvalidName ? (
              <FieldError>{t('invalidFieldName', { tagName: `<${fallbackTagName}>` })}</FieldError>
            ) : (
              <FieldDescription>{t('fieldNameHelp')}</FieldDescription>
            )}
          </Field>

          <Field>
            <FieldLabel htmlFor={`${field.id}-content`}>{t('contentLabel')}</FieldLabel>
            <Textarea
              id={`${field.id}-content`}
              value={field.content}
              placeholder={t('contentPlaceholder')}
              className="min-h-24"
              onChange={(event) => updateField(field.id, 'content', event.target.value)}
            />
          </Field>

          {childFields.length > 0 ? (
            <FieldGroup className="gap-3 border-l pl-3 md:pl-4">
              {childFields.map((childField, childIndex) =>
                renderField(childField, childIndex, childFields.length, depth + 1, [...path, childIndex]),
              )}
            </FieldGroup>
          ) : null}
        </FieldContent>
      </Field>
    );
  }

  return (
    <main className="bg-background text-foreground h-dvh overflow-hidden">
      <div className="mx-auto flex h-full w-full max-w-[1200px] flex-col gap-4 overflow-hidden px-4 py-4 md:gap-5 md:px-6 md:py-6 lg:gap-6 lg:px-8 lg:py-8">
        <header className="flex shrink-0 flex-col justify-between gap-4 md:min-h-16 md:flex-row md:items-center">
          <div className="flex min-w-0 flex-col gap-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="font-heading text-2xl font-medium tracking-normal md:text-3xl">{t('title')}</h1>
              <Badge variant="secondary">{t('modeBadge')}</Badge>
            </div>
            <p className="text-muted-foreground text-sm">{t('subtitle')}</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <ToggleGroup
              type="single"
              variant="outline"
              size="sm"
              value={locale}
              aria-label={t('languageToggle')}
              onValueChange={changeLocale}
            >
              <ToggleGroupItem value="en">EN</ToggleGroupItem>
              <ToggleGroupItem value="ko">KO</ToggleGroupItem>
            </ToggleGroup>
            <Badge variant="outline">{t('shapeBadge')}</Badge>
            <Badge variant={result.empty ? 'secondary' : 'default'}>
              {t('includedCount', { count: result.includedFields.length })}
            </Badge>
          </div>
        </header>

        <div className="grid min-h-0 flex-1 grid-rows-[minmax(0,1fr)_minmax(0,1fr)] gap-4 md:grid-cols-[minmax(320px,5fr)_minmax(0,7fr)] md:grid-rows-1 md:gap-5 lg:gap-6">
          <Card className="min-h-0 min-w-0" size="sm">
            <CardHeader className="shrink-0">
              <CardTitle>{t('inputsTitle')}</CardTitle>
              <CardDescription>{t('fieldCount', { count: totalFields })}</CardDescription>
              <CardAction>
                <Button type="button" size="sm" onClick={addField}>
                  <PlusIcon data-icon="inline-start" />
                  {t('addField')}
                </Button>
              </CardAction>
            </CardHeader>

            <CardContent className="min-h-0 flex-1 overflow-hidden">
              <ScrollArea className="h-full">
                <div className="pr-3 pb-1">
                  <FieldGroup className="gap-4">
                    {fields.map((field, index) => renderField(field, index, fields.length, 0, [index]))}
                  </FieldGroup>
                </div>
              </ScrollArea>
            </CardContent>

            <CardFooter className="shrink-0 justify-between gap-2">
              <Button type="button" variant="outline" onClick={resetFields}>
                <RotateCcwIcon data-icon="inline-start" />
                {t('reset')}
              </Button>
              {fallbackCount > 0 ? (
                <Badge variant="destructive">{t('fallbackCount', { count: fallbackCount })}</Badge>
              ) : null}
            </CardFooter>
          </Card>

          <Card className="min-h-0 min-w-0" size="sm">
            <CardHeader className="shrink-0">
              <CardTitle>{t('previewTitle')}</CardTitle>
              <CardDescription>{result.empty ? t('previewWaiting') : t('previewReady')}</CardDescription>
              <CardAction>
                <Button type="button" size="sm" disabled={!result.xml} onClick={copyXml}>
                  <ClipboardIcon data-icon="inline-start" />
                  {t('copyXml')}
                </Button>
              </CardAction>
            </CardHeader>

            <CardContent className="min-h-0 flex-1 overflow-hidden">
              {result.empty ? (
                <ScrollArea className="h-full rounded-lg border">
                  <div className="flex min-h-full items-center justify-center p-4">
                    <Empty>
                      <EmptyHeader>
                        <EmptyMedia variant="icon">
                          <FileCodeIcon />
                        </EmptyMedia>
                        <EmptyTitle>{t('emptyTitle')}</EmptyTitle>
                        <EmptyDescription>{t('emptyDescription')}</EmptyDescription>
                      </EmptyHeader>
                    </Empty>
                  </div>
                </ScrollArea>
              ) : (
                <ScrollArea className="bg-muted h-full rounded-lg border">
                  <pre
                    tabIndex={0}
                    aria-label={t('generatedXmlLabel')}
                    className="text-foreground focus-visible:border-ring focus-visible:ring-ring/30 min-h-full min-w-max p-4 text-sm leading-6 outline-none focus-visible:ring-3"
                  >
                    <code>{result.xml}</code>
                  </pre>
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
