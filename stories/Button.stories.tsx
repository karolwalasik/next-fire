import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import {KButton} from './Button';

export default {
  title: 'Example/Button',
  component: KButton,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as ComponentMeta<typeof KButton>;

const Template: ComponentStory<typeof KButton> = (args) => <KButton {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  label: 'Button',
};

// export const Secondary = Template.bind({});
// Secondary.args = {
//   label: 'Button',
// };

// export const Large = Template.bind({});
// Large.args = {
//   size: 'large',
//   label: 'Button',
// };

// export const Small = Template.bind({});
// Small.args = {
//   size: 'small',
//   label: 'Button',
// };
