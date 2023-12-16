import {useState, useEffect} from 'react';
import {Container, rem, Stepper} from '@mantine/core';
import {useLocation} from 'react-router-dom';
import {
  IconCircleCheck,
  IconPhoto, IconShieldCheck,
  IconUserCheck,
} from '@tabler/icons-react';
const StepperComponent = () => {
  const [active, setActive] = useState(1);
  const location = useLocation();

  useEffect(() => {
    switch (location.pathname) {
      case '/dashboard/profile':
        setActive(0);
        break;
      case '/dashboard/picture':
        setActive(1);
        break;
      default:
        setActive(0);
        break;
    }
  }, [location]);


  return (
    <Container size="md" style={{marginTop: '2rem'}}>
      {/* eslint-disable-next-line max-len */}
      <Stepper
        active={active}
        onStepClick={setActive}
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
          icon={<IconPhoto
            style={{width: rem(18), height: rem(18)}} />}
          label="Step 2"
          description="add background"
        />
        <Stepper.Step
          icon={<IconShieldCheck style={{width: rem(18), height: rem(18)}} />}
          label="Step 3"
          description="check website"
        />
      </Stepper>
    </Container>
  );
};

export default StepperComponent;
