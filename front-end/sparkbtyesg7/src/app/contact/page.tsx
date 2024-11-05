// src/pages/contact.tsx

import React from 'react';

const Contact: React.FC = () => {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Contact Us</h1>
      <p>If you have questions or need assistance, please reach out to any of our team members below:</p>
      <ul>
        <li><strong>Kevin:</strong> 718-316-8052, <a href="mailto:dkevin@bu.edu">dkevin@bu.edu</a></li>
        <li><strong>Dana:</strong> 617-901-1450, <a href="mailto:dalzahed@bu.edu">dalzahed@bu.edu</a></li>
        <li><strong>Ming:</strong> 415-996-5446, <a href="mailto:soongming18@gmail.com">soongming18@gmail.com</a></li>
        <li><strong>Josh:</strong> 917-376-4766, <a href="mailto:jhsualva@bu.edu">jhsualva@bu.edu</a></li>
      </ul>
    </div>
  );
};

export default Contact;