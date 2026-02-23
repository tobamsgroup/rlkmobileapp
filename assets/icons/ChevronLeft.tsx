import { SvgXml, XmlProps } from "react-native-svg";

export default (props: Omit<XmlProps, "xml">) => {
  const strokeColor = props?.stroke || "#666666"
  const strokeWidth = props?.strokeWidth || "2"
  const xml = `<svg width="9" height="14" viewBox="0 0 9 14" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M8 1L1 7L8 13" stroke=${String(strokeColor)} stroke-width=${String(strokeWidth)} stroke-linecap="round" stroke-linejoin="round"/>
</svg>

`;
  let prop = { ...props, xml: xml };
  return <SvgXml {...prop} />;
};
