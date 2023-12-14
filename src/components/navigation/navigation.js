import React, {useState, useEffect} from 'react';
import {
  createStyles, Navbar,
  Group, getStylesRef, rem, Image,
} from '@mantine/core';
import {
  IconWorldWww,
  IconTrash,
  IconLayoutDashboard, IconLogout,
} from '@tabler/icons-react';
import {logoutThunk, deleteUserThunk} from '../../services/authorize-thunk';
import {useDispatch} from 'react-redux';
import {useNavigate} from 'react-router-dom';
import {useSelector} from 'react-redux';
import keelworksLogo from '../../icons/keelworksIcon.svg';

const useStyles = createStyles((theme) => ({

  header: {
    paddingBottom: theme.spacing.md,
    marginBottom: `calc(${theme.spacing.md} * 1.5)`,
    borderBottom: `${rem(1)} solid ${
      theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2]
    }`,
  },

  footer: {
    paddingTop: theme.spacing.md,
    marginTop: theme.spacing.md,
    borderTop: `${rem(1)} solid ${
      theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2]
    }`,
  },

  link: {
    ...theme.fn.focusStyles(),
    'display': 'flex',
    'alignItems': 'center',
    'textDecoration': 'none',
    'fontSize': theme.fontSizes.sm,
    // eslint-disable-next-line max-len
    'color': theme.colorScheme === 'dark' ? theme.colors.dark[1] : theme.colors.gray[7],
    'padding': `${theme.spacing.xs} ${theme.spacing.sm}`,
    'borderRadius': theme.radius.sm,
    'fontWeight': 500,

    '&:hover': {
      // eslint-disable-next-line max-len
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
      color: theme.colorScheme === 'dark' ? theme.white : theme.black,

      [`& .${getStylesRef('icon')}`]: {
        color: theme.colorScheme === 'dark' ? theme.white : theme.black,
      },
    },
  },
  linkIcon: {
    ref: getStylesRef('icon'),
    minWidth: 24,
    minHeight: 24,
    color: theme.colorScheme === 'dark' ?
      theme.colors.dark[2] : theme.colors.gray[6],
    marginRight: theme.spacing.sm,
  },

  linkActive: {
    '&, &:hover': {
      // eslint-disable-next-line max-len
      backgroundColor: theme.fn.variant({variant: 'light', color: theme.primaryColor}).background,
      // eslint-disable-next-line max-len
      color: theme.fn.variant({variant: 'light', color: theme.primaryColor}).color,
      [`& .${getStylesRef('icon')}`]: {
        // eslint-disable-next-line max-len
        color: theme.fn.variant({variant: 'light', color: theme.primaryColor}).color,
      },
    },
  },
}));


const VerticalNavbar = () => {
  const {classes, cx} = useStyles();
  const [active, setActive] = useState('Dashboard');
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 920);
  const user = useSelector((state) => state.currentUser);
  const data = [
    {link: '/dashboard/profile', label: 'Dashboard', icon: IconLayoutDashboard},
    {link: user ? `/user/${user._id}` : '/user/default',
      label: 'Website', icon: IconWorldWww},
  ];
  // Shows icon only when the winodw size is less then 920px
  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= 920);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);


  const links = data.map((item) => (
    <a
      className={cx(classes.link,
          {[classes.linkActive]: item.label === active})}
      href={item.link}
      key={item.label}
      onClick={(event) => {
        // event.preventDefault();
        setActive(item.label);
      } }
    >
      <item.icon className={classes.linkIcon} stroke={1.5} />
      <span style={{display: isSmallScreen ? 'none' : 'inline'}}>
        {item.label}</span>
    </a>
  ));
  // Logout and delete account handle
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // eslint-disable-next-line max-len
  const userId = useSelector((state) => state.currentUser ? state.currentUser._id : null);

  const handleLogoutClick = () => {
    console.log('Logout button clicked');
    // 在这里添加你的注销逻辑
    dispatch(logoutThunk())
        .then(() => {
          localStorage.removeItem('currentUser');
          navigate('/login'); // 你的登录页面路由，这里假设它是/login
        });
  };

  const handleDeleteAccountClick = () => {
    console.log('Delete Account button clicked');
    // 在这里添加你的删除帐户逻辑
    // eslint-disable-next-line max-len
    const confirmation = window.confirm('Are you sure you want to delete your account?');
    if (confirmation) {
      dispatch(deleteUserThunk(userId))
          .then(() => {
            navigate('/login'); // 你的登录页面路由，这里假设它是/login
          });
    }
  };

  return (
    <Navbar p="md">
      <Navbar.Section grow>
        <Group className={classes.header} position="apart">
          <Image src ={keelworksLogo} size={28}/>
        </Group>
        {links}
      </Navbar.Section>

      <Navbar.Section className={classes.footer}>
        <a href="#" className={classes.link}
          onClick={handleLogoutClick}>
          <IconLogout className={classes.linkIcon} stroke={1.5} />
          {/* <span>Logout</span>*/}
          <span style={{display: isSmallScreen ? 'none' : 'inline'}}>
            Logout
          </span>
        </a>

        <a href="#" className={classes.link}
          onClick={handleDeleteAccountClick}>
          <IconTrash className={classes.linkIcon} stroke={1.5} />
          {/* <span>Delete account</span>*/}
          <span style={{display: isSmallScreen ? 'none' : 'inline'}}>
            Delete account
          </span>
        </a>
      </Navbar.Section>
    </Navbar>
  );
};

export default VerticalNavbar;
