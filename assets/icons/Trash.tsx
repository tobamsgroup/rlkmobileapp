import { SvgXml, XmlProps } from 'react-native-svg';

export default (props: Omit<XmlProps, 'xml'>) => {
  const xml = `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M5.33594 9.33333H26.6693M13.3359 14.6667V22.6667M18.6693 14.6667V22.6667M6.66927 9.33333L8.0026 25.3333C8.0026 26.0406 8.28356 26.7189 8.78365 27.219C9.28375 27.719 9.96203 28 10.6693 28H21.3359C22.0432 28 22.7215 27.719 23.2216 27.219C23.7217 26.7189 24.0026 26.0406 24.0026 25.3333L25.3359 9.33333M12.0026 9.33333V5.33333C12.0026 4.97971 12.1431 4.64057 12.3931 4.39052C12.6432 4.14048 12.9823 4 13.3359 4H18.6693C19.0229 4 19.362 4.14048 19.6121 4.39052C19.8621 4.64057 20.0026 4.97971 20.0026 5.33333V9.33333" stroke="#DE2121" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`;
  let prop = { ...props, xml: xml };
  return <SvgXml {...prop} />;
};
