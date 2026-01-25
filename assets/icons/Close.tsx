




import { SvgXml, XmlProps } from "react-native-svg";

export default (props: Omit<XmlProps, "xml">) => {
  const strokeWith = props?.strokeWidth ?? "3.55556"
  const strokeColor = props?.stroke ?? "#666666"
  const xml = `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M24 8L8 24" stroke=${String(strokeColor)} stroke-width=${String(strokeWith)} stroke-linecap="round" stroke-linejoin="round"/>
<path d="M8 8L24 24" stroke=${String(strokeColor)} stroke-width=${String(strokeWith)} stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`;
  let prop = { ...props, xml: xml };
  return <SvgXml {...prop} />;
};
