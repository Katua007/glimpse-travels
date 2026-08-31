import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';
import './Button.css';

const MotionLink = motion(Link);

function Button({
  variant = 'primary',
  icon: Icon,
  iconOnly = false,
  ariaLabel,
  to,
  className = '',
  children,
  ...rest
}) {
  const prefersReducedMotion = useReducedMotion();
  const classes = `btn btn-${variant} ${iconOnly ? 'btn-icon-only' : ''} ${className}`.trim();
  const tapProps = prefersReducedMotion ? {} : { whileTap: { scale: 0.96 } };
  const a11yProps = iconOnly ? { 'aria-label': ariaLabel } : {};

  const content = (
    <>
      {Icon && <Icon size={18} aria-hidden="true" />}
      {!iconOnly && children}
    </>
  );

  if (to) {
    return (
      <MotionLink to={to} className={classes} {...a11yProps} {...tapProps} {...rest}>
        {content}
      </MotionLink>
    );
  }

  return (
    <motion.button className={classes} {...a11yProps} {...tapProps} {...rest}>
      {content}
    </motion.button>
  );
}

export default Button;
