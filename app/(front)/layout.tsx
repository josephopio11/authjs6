import Navbar from "@/components/navbar";

type FrontLayoutProps = {
  children: React.ReactNode;
};

const FrontLayout = ({ children }: FrontLayoutProps) => {
  return (
    <div>
      <Navbar />
      {children}
    </div>
  );
};

export default FrontLayout;
