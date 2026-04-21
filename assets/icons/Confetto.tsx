




import { SvgXml, XmlProps } from "react-native-svg";

export default (props: Omit<XmlProps, "xml">) => {
  const xml = `<svg width="8" height="13" viewBox="0 0 8 13" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M1.87744 1.63006C4.05584 7.59325 -1.43185 9.14379 0.369378 13L6.48563 11.4893C4.68418 7.63312 9.45996 6.16209 7.53293 0L1.87744 1.63006Z" fill="url(#paint0_linear_7258_49314)"/>
<defs>
<linearGradient id="paint0_linear_7258_49314" x1="6.30133" y1="10.1949" x2="1.83956" y2="2.354" gradientUnits="userSpaceOnUse">
<stop stop-color="#FF9214"/>
<stop offset="1" stop-color="#FF4E0D"/>
</linearGradient>
</defs>
</svg>

`;
  let prop = { ...props, xml: xml };
  return <SvgXml {...prop} />;
};
