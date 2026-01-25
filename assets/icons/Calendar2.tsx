import { SvgXml, XmlProps } from "react-native-svg";

export default (props: Omit<XmlProps, "xml">) => {
  const xml = `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M13.3359 2.5V5.83333M6.66927 2.5V5.83333M3.33594 9.16667H16.6693M3.33594 5.83333C3.33594 5.39131 3.51153 4.96738 3.82409 4.65482C4.13665 4.34226 4.56058 4.16667 5.0026 4.16667H15.0026C15.4446 4.16667 15.8686 4.34226 16.1811 4.65482C16.4937 4.96738 16.6693 5.39131 16.6693 5.83333V15.8333C16.6693 16.2754 16.4937 16.6993 16.1811 17.0118C15.8686 17.3244 15.4446 17.5 15.0026 17.5H5.0026C4.56058 17.5 4.13665 17.3244 3.82409 17.0118C3.51153 16.6993 3.33594 16.2754 3.33594 15.8333V5.83333ZM6.66927 12.5H8.33594V14.1667H6.66927V12.5Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`;
  let prop = { ...props, xml: xml };
  return <SvgXml {...prop} />;
};
