

import { SvgXml, XmlProps } from "react-native-svg";

export default (props: Omit<XmlProps, "xml">) => {
  const strokeColor = props?.color || "#3F9243"
  const xml = `<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_5450_21491)">
<path d="M6.74719 12.1303L3.61969 9.00281L2.55469 10.0603L6.74719 14.2528L15.7472 5.25281L14.6897 4.19531L6.74719 12.1303Z" fill="${String(strokeColor)}"/>
</g>
<defs>
<clipPath id="clip0_5450_21491">
<rect width="18" height="18" fill="white"/>
</clipPath>
</defs>
</svg>

`;
  let prop = { ...props, xml: xml };
  return <SvgXml {...prop} />;
};

