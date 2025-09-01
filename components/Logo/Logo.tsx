import {
  Group,
  Text,
  UnstyledButton,
  UnstyledButtonProps,
  ThemeIcon,
} from '@mantine/core';
import { IconPigMoney } from '@tabler/icons-react';
import Link from 'next/link';

import classes from './Logo.module.css';

type LogoProps = {
  href?: string;
  showText?: boolean;
} & UnstyledButtonProps;

const Logo = ({ href, showText = true, ...others }: LogoProps) => {
  return (
    <UnstyledButton
      className={classes.logo}
      component={Link}
      href={href || '/'}
      {...others}
    >
      <Group gap="xs">
        <ThemeIcon 
          size={showText ? 32 : 24} 
          variant="gradient" 
          gradient={{ from: 'blue', to: 'cyan' }}
        >
          <IconPigMoney size={showText ? 20 : 16} />
        </ThemeIcon>
        {showText && <Text fw={700}>Internato Financeiro</Text>}
      </Group>
    </UnstyledButton>
  );
};

export default Logo;
