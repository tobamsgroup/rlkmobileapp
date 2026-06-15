import { SvgXml, XmlProps } from "react-native-svg";

export default (props: Omit<XmlProps, "xml">) => {
  const strokeColor = props.stroke ?? "#221D23";
  const xml = `<svg width="14" height="8" viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M0.75 7.25L6.75 1.25L12.75 7.25" stroke="${String(strokeColor)}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;
  let prop = { ...props, xml: xml };
  return <SvgXml {...prop} />;
};