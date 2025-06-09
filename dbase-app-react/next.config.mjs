import transpileModules from 'next-transpile-modules';

/** @type {import('next').NextConfig} */
const withTM = transpileModules([
  'antd',
  '@ant-design/icons',
  'rc-util',
  'rc-pagination',
  'rc-picker',
  'rc-input',
  'rc-table',
  'rc-tree',
]);

const nextConfig = withTM({});

export default nextConfig;