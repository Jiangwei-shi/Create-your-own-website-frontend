import React from 'react';
import {createStyles, Container,
  Title, Text, Button, Image} from '@mantine/core';
import notFoundImage from '../icons/login.jpg';

const useStyles = createStyles((theme) => ({
  root: {
    paddingTop: theme.spacing.xl * 2,
    paddingBottom: theme.spacing.xl * 2,
  },
  title: {
    fontWeight: 900,
    fontSize: theme.fontSizes.xl * 2,
    marginBottom: theme.spacing.md,
    fontFamily: 'Greycliff CF, sans-serif',
  },
  text: {
    color: theme.colorScheme === 'dark' ?
      theme.colors.dark[1] : theme.colors.gray[7],
    fontSize: theme.fontSizes.lg,
  },
  button: {
    marginTop: theme.spacing.xl,
  },
  image: {
    display: 'block',
    maxWidth: '100%',
  },
}));

// eslint-disable-next-line require-jsdoc
export function NotFoundPage() {
  const {classes} = useStyles();

  return (
    <Container className={classes.root}>
      <Image src={notFoundImage} className={classes.image} />
      <Title className={classes.title}>Something is not right...</Title>
      <Text className={classes.text}>
        Page you are trying to open does not exist.
        You may have mistyped the address, or the
        page has been moved to another URL.
        If you think this is an error contact support.
      </Text>
      <Button variant="outline" size="md" className={classes.button}>
        Get back to home page
      </Button>
    </Container>
  );
}

export default NotFoundPage;
