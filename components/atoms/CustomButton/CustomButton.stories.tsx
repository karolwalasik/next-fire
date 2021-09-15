import { ComponentMeta, ComponentStory } from "@storybook/react";
import { CustomButton } from "./CustomButton";


export default {
    title: 'components/atoms/CustomButton',
    component: CustomButton,
    argTypes: {
        label: { control: 'text' },
        isSmall: {control: 'boolean'}
      },
} as ComponentMeta<typeof CustomButton>

const Template: ComponentStory<typeof CustomButton> = (args) => <CustomButton {...args} />;

export const Default = Template.bind({})
Default.args = {
    label: 'Button',
  };

export const Small = Template.bind({})
Small.args = {
    label: 'Button',
    isSmall: true
  };