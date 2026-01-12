import { SvgXml, XmlProps } from "react-native-svg";

export default (props: Omit<XmlProps, "xml">) => {
  const xml = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_5521_10825)">
<path d="M10 20V14H14V20H19V12H22L12 3L2 12H5V20H10Z" fill=${String(props.fill) || "#193A1B"}/>
</g>
<defs>
<clipPath id="clip0_5521_10825">
<rect width="24" height="24" fill="white"/>
</clipPath>
</defs>
</svg>
`;
  let prop = { ...props, xml: xml };
  return <SvgXml {...prop} />;
};
