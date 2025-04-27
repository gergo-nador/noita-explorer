interface Props {
  children?: string;
}

export const Separator = ({ children }: Props) => {
  return (
    <div style={{ fontSize: 18 }}>
      <hr />
      {children}
      <hr />
    </div>
  );
};
