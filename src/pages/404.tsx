import React from 'react';
import Exception from 'src/components/Exception';
import Link from 'umi/link';

// import Exception from

export default () => (
  <Exception type="404" style={{ minHeight: 500, height: '80%' }} linkElement={Link} />
);
