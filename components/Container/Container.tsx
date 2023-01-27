import { Container } from "@mui/material";

type Props = {
  children: any;
  maxWidth: any;
};

const SystemContainer: React.FC<Props> = ({ children, maxWidth }) => {
  return (
    <>
      <Container maxWidth={maxWidth}>{children}</Container>
    </>
  );
};

export default SystemContainer;
