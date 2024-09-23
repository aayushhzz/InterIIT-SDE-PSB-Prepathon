import React from "react";
import '../App.css';

const GlassCard = ({ children }) => {
  return (
    <div className="glass-card">
      {children}
    </div>
  );
};

export default GlassCard;
