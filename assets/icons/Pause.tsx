


import { SvgXml, XmlProps } from "react-native-svg";

export default (props: Omit<XmlProps, "xml">) => {
  const xml = `<svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M11.0833 15.0418V3.9585H14.25V15.0418H11.0833ZM4.75 15.0418V3.9585H7.91667V15.0418H4.75Z" fill="white"/>
</svg>
`;
  let prop = { ...props, xml: xml };
  return <SvgXml {...prop} />;
};
