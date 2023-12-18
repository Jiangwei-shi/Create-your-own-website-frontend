import {useState, useEffect} from 'react';
import {Container, rem, Stepper} from '@mantine/core';
import {useLocation, useNavigate} from 'react-router-dom';
import {
  IconCircleCheck,
  IconPhoto, IconMusic,
  IconUserCheck,
} from '@tabler/icons-react';

const StepperComponent = () => {
  const [active, setActive] = useState(1);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    switch (location.pathname) {
      case '/dashboard/profile':
        setActive(0);
        break;
      case '/dashboard/picture':
        setActive(1);
        break;
      case '/dashboard/music':
        setActive(2);
        break;
      default:
        setActive(0);
        break;
    }
  }, [location]);

  const handleStepClick = (step) => {
    setActive(step);
    switch (step) {
      case 0:
        navigate('/dashboard/profile');
        break;
      case 1:
        navigate('/dashboard/picture');
        break;
      case 2:
        navigate('/dashboard/music');
        break;
      default:
        break;
    }
  };

  return (
    <Container size="md" style={{marginTop: '2rem'}}>
      <Stepper
        active={active}
        onStepClick={handleStepClick}
        allowNextStepsSelect={false}

        completedIcon={<IconCircleCheck
          style={{width: rem(18), height: rem(18)}} />}
      >
        <Stepper.Step
          icon={<IconUserCheck style={{width: rem(18), height: rem(18)}} />}
          label="Step 1"
          description="your information"
        />
        <Stepper.Step
          icon={<IconPhoto style={{width: rem(18), height: rem(18)}} />}
          label="Step 2"
          description="add background"
        />
        <Stepper.Step
          icon={<IconMusic style={{width: rem(18), height: rem(18)}} />}
          label="Step 3"
          description="check website"
        />
      </Stepper>
    </Container>
  );
};

export default StepperComponent;

