export type XmlFieldInput = {
  name?: string;
  content?: string;
  children?: XmlFieldInput[];
};

export type XmlIncludedField = {
  path: number[];
  tagName: string;
  originalName: string;
  usedFallback: boolean;
};

export type XmlConversionResult = {
  xml: string;
  includedFields: XmlIncludedField[];
  empty: boolean;
};

const XML_TAG_NAME_PATTERN = /^[A-Za-z_][A-Za-z0-9_-]*$/;
const XML_ENTITY_PATTERN = /&(?!amp;|lt;|gt;|quot;|apos;|#\d+;|#x[0-9A-Fa-f]+;)/g;
const LINE_BREAK_PATTERN = /\r\n|\r|\n/;

export function isValidXmlTagName(name: string) {
  return XML_TAG_NAME_PATTERN.test(name);
}

export function getFallbackTagName(index: number) {
  return `field-${index + 1}`;
}

export function getSafeXmlTagName(name: string | undefined, index: number) {
  const trimmedName = name?.trim() ?? '';

  if (isValidXmlTagName(trimmedName)) {
    return {
      tagName: trimmedName,
      usedFallback: false,
    };
  }

  return {
    tagName: getFallbackTagName(index),
    usedFallback: true,
  };
}

export function escapeXmlText(content: string) {
  return content.replace(XML_ENTITY_PATTERN, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function getIndent(depth: number) {
  return '  '.repeat(depth);
}

function getEscapedContentLines(content: string, depth: number) {
  const contentIndent = getIndent(depth + 1);

  return content.split(LINE_BREAK_PATTERN).map((line) => `${contentIndent}${escapeXmlText(line)}`);
}

export function formatXmlElement(tagName: string, content: string, children: string[] = [], depth = 0) {
  const indent = getIndent(depth);

  if (!children.length && !LINE_BREAK_PATTERN.test(content)) {
    return `${indent}<${tagName}>${escapeXmlText(content)}</${tagName}>`;
  }

  const contentLines = content ? getEscapedContentLines(content, depth) : [];

  return [`${indent}<${tagName}>`, ...contentLines, ...children, `${indent}</${tagName}>`].join('\n');
}

function buildXmlElements(
  fields: XmlFieldInput[],
  depth: number,
  parentPath: number[],
  includedFields: XmlIncludedField[],
) {
  return fields.reduce<string[]>((acc, field, index) => {
    const childPath = [...parentPath, index];
    const childIncludedFields: XmlIncludedField[] = [];
    const childElements = buildXmlElements(field.children ?? [], depth + 1, childPath, childIncludedFields);
    const hasContent = Boolean(field.content?.trim());

    const { tagName, usedFallback } = getSafeXmlTagName(field.name, index);

    if (!hasContent && !childElements.length) {
      return acc;
    }

    includedFields.push({
      path: childPath,
      tagName,
      originalName: field.name?.trim() ?? '',
      usedFallback,
    });
    includedFields.push(...childIncludedFields);
    acc.push(formatXmlElement(tagName, hasContent ? (field.content ?? '') : '', childElements, depth));

    return acc;
  }, []);
}

export function buildXmlDocument(fields: XmlFieldInput[]): XmlConversionResult {
  const includedFields: XmlIncludedField[] = [];
  const xmlElements = buildXmlElements(fields, 0, [], includedFields);

  if (!includedFields.length) {
    return {
      xml: '',
      includedFields,
      empty: true,
    };
  }

  return {
    xml: xmlElements.join('\n'),
    includedFields,
    empty: false,
  };
}
