import React from 'react';
import ReactDOM from 'react-dom/client';
import { LocaleProvider } from './contexts/LocaleContext';
import './styles/global.css';

// Import all demos
import AvatarImageDemo from './demos/AvatarImageDemo';
import ButtonDemo from './demos/ButtonDemo';
import CardDemo from './demos/CardDemo';
import CodeInputDemo from './demos/CodeInputDemo';
import CouponInputDemo from './demos/CouponInputDemo';
import ErrorDisplayDemo from './demos/ErrorDisplayDemo';
import ImagesInputDemo from './demos/ImagesInputDemo';
import KeyValueInputDemo from './demos/KeyValueInputDemo';
import LoaderDemo from './demos/LoaderDemo';
import MultiSelectDemo from './demos/MultiSelectDemo';
import NumberInputDemo from './demos/NumberInputDemo';
import PaginatedTableDemo from './demos/PaginatedTableDemo';
import PaginationButtonsDemo from './demos/PaginationButtonsDemo';
import PhoneInputDemo from './demos/PhoneInputDemo';
import PriceDemo from './demos/PriceDemo';
import RadioInputDemo from './demos/RadioInputDemo';
import RadioSelectDemo from './demos/RadioSelectDemo';
import SelectBoxDemo from './demos/SelectBoxDemo';
import TextAreaDemo from './demos/TextAreaDemo';
import TextBoxDemo from './demos/TextBoxDemo';
import ToggleInputDemo from './demos/ToggleInputDemo';

const demos = [
  { name: 'AvatarImage', component: <AvatarImageDemo /> },
  { name: 'Button', component: <ButtonDemo /> },
  { name: 'Card', component: <CardDemo /> },
  { name: 'CodeInput', component: <CodeInputDemo /> },
  { name: 'CouponInput', component: <CouponInputDemo /> },
  { name: 'ErrorDisplay', component: <ErrorDisplayDemo /> },
  { name: 'ImagesInput', component: <ImagesInputDemo /> },
  { name: 'KeyValueInput', component: <KeyValueInputDemo /> },
  { name: 'Loader', component: <LoaderDemo /> },
  { name: 'MultiSelect', component: <MultiSelectDemo /> },
  { name: 'NumberInput', component: <NumberInputDemo /> },
  { name: 'PaginatedTable', component: <PaginatedTableDemo /> },
  { name: 'PaginationButtons', component: <PaginationButtonsDemo /> },
  { name: 'PhoneInput', component: <PhoneInputDemo /> },
  { name: 'Price', component: <PriceDemo /> },
  { name: 'RadioInput', component: <RadioInputDemo /> },
  { name: 'RadioSelect', component: <RadioSelectDemo /> },
  { name: 'SelectBox', component: <SelectBoxDemo /> },
  { name: 'TextArea', component: <TextAreaDemo /> },
  { name: 'TextBox', component: <TextBoxDemo /> },
  { name: 'ToggleInput', component: <ToggleInputDemo /> },
];

const App = () => (
  <LocaleProvider locale="en">
    <div style={{ padding: '2rem' }}>
      <h1>UI Library – Component Demos</h1>
      <hr style={{ margin: '1rem 0' }} />
      {demos.map((demo) => (
        <div key={demo.name} style={{ marginBottom: '3rem' }}>
          <h2 style={{ borderBottom: '2px solid #ccc', marginBottom: '1rem' }}>
            {demo.name}
          </h2>
          {demo.component}
        </div>
      ))}
    </div>
  </LocaleProvider>
);

ReactDOM.createRoot(document.getElementById('root')!).render(<App />);