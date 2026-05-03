export type XmlFieldInput = {
  name?: string;
  content?: string;
};

export type XmlIncludedField = {
  index: number;
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

export function formatXmlElement(tagName: string, content: string) {
  if (!LINE_BREAK_PATTERN.test(content)) {
    return `<${tagName}>${escapeXmlText(content)}</${tagName}>`;
  }

  const contentLines = content.split(LINE_BREAK_PATTERN).map((line) => `  ${escapeXmlText(line)}`);

  return [`<${tagName}>`, ...contentLines, `</${tagName}>`].join('\n');
}

export function buildXmlDocument(fields: XmlFieldInput[]): XmlConversionResult {
  const includedFields = fields.reduce<XmlIncludedField[]>((acc, field, index) => {
    if (!field.content?.trim()) {
      return acc;
    }

    const { tagName, usedFallback } = getSafeXmlTagName(field.name, index);

    acc.push({
      index,
      tagName,
      originalName: field.name?.trim() ?? '',
      usedFallback,
    });

    return acc;
  }, []);

  if (!includedFields.length) {
    return {
      xml: '',
      includedFields,
      empty: true,
    };
  }

  const childLines = includedFields.map((field) => {
    const content = fields[field.index]?.content ?? '';

    return formatXmlElement(field.tagName, content);
  });

  return {
    xml: childLines.join('\n'),
    includedFields,
    empty: false,
  };
}
