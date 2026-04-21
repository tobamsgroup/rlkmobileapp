import { SvgXml, XmlProps } from 'react-native-svg';

export default (props: Omit<XmlProps, 'xml'>) => {
  const xml = `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M3.33594 14.1673V15.834C3.33594 16.276 3.51153 16.6999 3.82409 17.0125C4.13665 17.3251 4.56058 17.5007 5.0026 17.5007H15.0026C15.4446 17.5007 15.8686 17.3251 16.1811 17.0125C16.4937 16.6999 16.6693 16.276 16.6693 15.834V14.1673M5.83594 9.16732L10.0026 13.334M10.0026 13.334L14.1693 9.16732M10.0026 13.334V3.33398" stroke="#474348" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
</svg>

`;
  let prop = { ...props, xml: xml };
  return <SvgXml {...prop} />;
};
