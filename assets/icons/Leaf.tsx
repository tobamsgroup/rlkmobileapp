import { SvgXml, XmlProps } from "react-native-svg";

export default (props: Omit<XmlProps, "xml">) => {
  const xml = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M4.99835 21C5.49835 16.5 7.49835 13 11.9984 11M8.99837 18C15.2164 18 19.4984 14.712 19.9984 6V4H15.9844C6.98438 4 3.99838 8 3.98438 13C3.98438 14 3.98438 16 5.98438 18H8.99837Z" stroke="#3F9243" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>

`;
  let prop = { ...props, xml: xml };
  return <SvgXml {...prop} />;
};
