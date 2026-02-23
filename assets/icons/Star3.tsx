

import { SvgXml, XmlProps } from "react-native-svg";

export default (props: Omit<XmlProps, "xml">) => {
  const xml = `<svg width="26" height="25" viewBox="0 0 26 25" fill="none" xmlns="http://www.w3.org/2000/svg">
<g filter="url(#filter0_i_6234_9755)">
<path d="M12.3743 0.431947C12.5614 -0.143872 13.3761 -0.143874 13.5632 0.431946L16.1961 8.53542C16.2798 8.79293 16.5198 8.96728 16.7905 8.96728H25.311C25.9165 8.96728 26.1682 9.74204 25.6784 10.0979L18.7852 15.1061C18.5661 15.2653 18.4745 15.5474 18.5581 15.8049L21.1911 23.9084C21.3782 24.4842 20.7192 24.963 20.2293 24.6072L13.3361 19.5989C13.1171 19.4398 12.8204 19.4398 12.6014 19.5989L5.70816 24.6072C5.21834 24.963 4.55929 24.4842 4.74638 23.9084L7.37936 15.8049C7.46303 15.5474 7.37137 15.2653 7.15232 15.1061L0.259089 10.0979C-0.230732 9.74204 0.0210018 8.96728 0.626454 8.96728H9.14695C9.41772 8.96728 9.65769 8.79293 9.74136 8.53542L12.3743 0.431947Z" fill="url(#paint0_linear_6234_9755)"/>
</g>
<defs>
<filter id="filter0_i_6234_9755" x="0" y="0" width="25.9375" height="25.9795" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="1.25"/>
<feGaussianBlur stdDeviation="1.25"/>
<feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0"/>
<feBlend mode="normal" in2="shape" result="effect1_innerShadow_6234_9755"/>
</filter>
<linearGradient id="paint0_linear_6234_9755" x1="23.4688" y1="21.1025" x2="23.8438" y2="-1.39746" gradientUnits="userSpaceOnUse">
<stop stop-color="#004D99"/>
<stop offset="0.355769" stop-color="#D3D2D3" stop-opacity="0.2"/>
<stop offset="0.6875" stop-color="#D3D2D3" stop-opacity="0.2"/>
</linearGradient>
</defs>
</svg>


`;
  let prop = { ...props, xml: xml };
  return <SvgXml {...prop} />;
};
