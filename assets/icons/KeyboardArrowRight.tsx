

import { SvgXml, XmlProps } from "react-native-svg";

export default (props: Omit<XmlProps, "xml">) => {
  const xml = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_5444_50328)">
<path d="M8.59375 16.59L13.1737 12L8.59375 7.41L10.0037 6L16.0037 12L10.0037 18L8.59375 16.59Z" fill=${String(props.fill) || "#3F9243"}/>
</g>
<defs>
<clipPath id="clip0_5444_50328">
<rect width="24" height="24" fill="white"/>
</clipPath>
</defs>
</svg>
`;
  let prop = { ...props, xml: xml };
  return <SvgXml {...prop} />;
};
