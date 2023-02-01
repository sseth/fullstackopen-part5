const Notification = ({ notif }) => {
  if (!notif || !notif.msg) return;

  const { msg, error } = notif;
  const color = error ? 'red' : 'green';
  const styles = {
    color,
    padding: '8px',
    marginTop: '15px',
    marginBottom: '15px',
    border: `2px solid ${color}`,
    borderRadius: '5px',
    background: 'lightGray',
  };

  return (
    <div style={styles}>
      <span>{msg}</span>
    </div>
  );
};

export default Notification;
