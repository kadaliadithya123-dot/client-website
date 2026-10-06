import FloatingContactWidget from "./FloatingContactWidget.jsx";

// Re-export FloatingContactWidget to preserve any legacy import references
const WhatsAppButton = (props) => <FloatingContactWidget {...props} />;

export default WhatsAppButton;
