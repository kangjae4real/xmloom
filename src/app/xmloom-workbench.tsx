'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  AlertCircleIcon,
  CheckIcon,
  ClipboardIcon,
  FileCodeIcon,
  PlusIcon,
  RotateCcwIcon,
  Trash2Icon,
} from 'lucide-react';
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
import { Textarea } from '@/components/shadcn/textarea';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/shadcn/tooltip';
import { buildXmlDocument, getFallbackTagName, isValidXmlTagName, type XmlFieldInput } from '@/utils/xml-conversion';

type WorkbenchField = XmlFieldInput & {
  id: string;
};

type CopyState = 'idle' | 'success' | 'error';

const INITIAL_FIELDS: WorkbenchField[] = [
  {
    id: 'field-1',
    name: '',
    content: '',
  },
];

export default function XmloomWorkbench() {
  const [fields, setFields] = useState<WorkbenchField[]>(INITIAL_FIELDS);
  const [nextFieldId, setNextFieldId] = useState(2);
  const [copyState, setCopyState] = useState<CopyState>('idle');

  const result = useMemo(() => buildXmlDocument(fields), [fields]);
  const fallbackCount = result.includedFields.filter((field) => field.usedFallback).length;

  useEffect(() => {
    if (copyState === 'idle') {
      return;
    }

    const timeout = window.setTimeout(() => setCopyState('idle'), 1800);

    return () => window.clearTimeout(timeout);
  }, [copyState]);

  function updateField(id: string, key: keyof XmlFieldInput, value: string) {
    setFields((currentFields) => currentFields.map((field) => (field.id === id ? { ...field, [key]: value } : field)));
    setCopyState('idle');
  }

  function addField() {
    const fieldId = `field-${nextFieldId}`;

    setFields((currentFields) => [
      ...currentFields,
      {
        id: fieldId,
        name: '',
        content: '',
      },
    ]);
    setNextFieldId((currentId) => currentId + 1);
    setCopyState('idle');
  }

  function removeField(id: string) {
    setFields((currentFields) => {
      if (currentFields.length <= 1) {
        return currentFields;
      }

      return currentFields.filter((field) => field.id !== id);
    });
    setCopyState('idle');
  }

  function resetFields() {
    setFields(INITIAL_FIELDS);
    setNextFieldId(2);
    setCopyState('idle');
  }

  async function copyXml() {
    if (!result.xml) {
      return;
    }

    try {
      await navigator.clipboard.writeText(result.xml);
      setCopyState('success');
    } catch {
      setCopyState('error');
    }
  }

  return (
    <main className="bg-background text-foreground min-h-screen">
      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-6 px-4 py-4 md:px-6 md:py-6 lg:px-8 lg:py-8">
        <header className="flex min-h-14 flex-col justify-between gap-4 md:min-h-16 md:flex-row md:items-center">
          <div className="flex min-w-0 flex-col gap-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="font-heading text-2xl font-medium tracking-normal md:text-3xl">XMLoom</h1>
              <Badge variant="secondary">Rules-based</Badge>
            </div>
            <p className="text-muted-foreground text-sm">Draft rough text into stable XML.</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline">Sibling tags</Badge>
            <Badge variant={result.empty ? 'secondary' : 'default'}>{result.includedFields.length} fields</Badge>
          </div>
        </header>

        <div className="grid min-h-[calc(100vh-7rem)] gap-4 md:grid-cols-[minmax(320px,5fr)_minmax(0,7fr)] md:gap-5 lg:gap-6">
          <Card className="min-w-0" size="sm">
            <CardHeader>
              <CardTitle>Inputs</CardTitle>
              <CardDescription>{fields.length} text fields</CardDescription>
              <CardAction>
                <Button type="button" size="sm" onClick={addField}>
                  <PlusIcon data-icon="inline-start" />
                  Add field
                </Button>
              </CardAction>
            </CardHeader>

            <CardContent>
              <FieldGroup className="gap-4">
                {fields.map((field, index) => {
                  const trimmedName = field.name?.trim() ?? '';
                  const hasInvalidName = Boolean(trimmedName && !isValidXmlTagName(trimmedName));
                  const fallbackTagName = getFallbackTagName(index);

                  return (
                    <Field key={field.id} data-invalid={hasInvalidName || undefined}>
                      <FieldContent className="bg-background gap-3 rounded-lg border p-3">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex min-w-0 flex-col gap-1">
                            <FieldTitle>Field {index + 1}</FieldTitle>
                            <FieldDescription>Tag fallback: &lt;{fallbackTagName}&gt;</FieldDescription>
                          </div>

                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon-sm"
                                aria-label={`Remove field ${index + 1}`}
                                disabled={fields.length <= 1}
                                onClick={() => removeField(field.id)}
                              >
                                <Trash2Icon />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Remove field</TooltipContent>
                          </Tooltip>
                        </div>

                        <Field>
                          <FieldLabel htmlFor={`${field.id}-name`}>Field name</FieldLabel>
                          <Input
                            id={`${field.id}-name`}
                            value={field.name}
                            aria-invalid={hasInvalidName || undefined}
                            placeholder="title"
                            onChange={(event) => updateField(field.id, 'name', event.target.value)}
                          />
                          {hasInvalidName ? (
                            <FieldError>
                              Will use &lt;{fallbackTagName}&gt; because this name is not XML-safe.
                            </FieldError>
                          ) : (
                            <FieldDescription>Letters, numbers, underscore, and hyphen.</FieldDescription>
                          )}
                        </Field>

                        <Field>
                          <FieldLabel htmlFor={`${field.id}-content`}>Content</FieldLabel>
                          <Textarea
                            id={`${field.id}-content`}
                            value={field.content}
                            placeholder="Write rough text here."
                            className="min-h-24"
                            onChange={(event) => updateField(field.id, 'content', event.target.value)}
                          />
                        </Field>
                      </FieldContent>
                    </Field>
                  );
                })}
              </FieldGroup>
            </CardContent>

            <CardFooter className="justify-between gap-2">
              <Button type="button" variant="outline" onClick={resetFields}>
                <RotateCcwIcon data-icon="inline-start" />
                Reset
              </Button>
              {fallbackCount > 0 ? <Badge variant="destructive">{fallbackCount} fallback tags</Badge> : null}
            </CardFooter>
          </Card>

          <Card className="min-w-0" size="sm">
            <CardHeader>
              <CardTitle>XML Preview</CardTitle>
              <CardDescription>{result.empty ? 'Waiting for content' : 'Generated sibling XML tags'}</CardDescription>
              <CardAction>
                <Button type="button" size="sm" disabled={!result.xml} onClick={copyXml}>
                  {copyState === 'success' ? (
                    <CheckIcon data-icon="inline-start" />
                  ) : (
                    <ClipboardIcon data-icon="inline-start" />
                  )}
                  Copy XML
                </Button>
              </CardAction>
            </CardHeader>

            <CardContent className="flex min-h-[420px] flex-col">
              {result.empty ? (
                <Empty className="min-h-[360px] border">
                  <EmptyHeader>
                    <EmptyMedia variant="icon">
                      <FileCodeIcon />
                    </EmptyMedia>
                    <EmptyTitle>No XML yet</EmptyTitle>
                    <EmptyDescription>Add content to generate preview.</EmptyDescription>
                  </EmptyHeader>
                </Empty>
              ) : (
                <pre
                  tabIndex={0}
                  aria-label="Generated XML"
                  className="bg-muted text-foreground focus-visible:border-ring focus-visible:ring-ring/30 min-h-[360px] overflow-auto rounded-lg border p-4 text-sm leading-6 outline-none focus-visible:ring-3"
                >
                  <code>{result.xml}</code>
                </pre>
              )}
            </CardContent>

            <CardFooter className="min-h-10 justify-between gap-2">
              <p className="text-muted-foreground text-sm" aria-live="polite">
                {copyState === 'success' ? 'Copied to clipboard.' : null}
                {copyState === 'error' ? 'Clipboard failed. Select the preview text manually.' : null}
              </p>
              {copyState === 'error' ? <AlertCircleIcon className="text-destructive" aria-hidden="true" /> : null}
            </CardFooter>
          </Card>
        </div>
      </div>
    </main>
  );
}
