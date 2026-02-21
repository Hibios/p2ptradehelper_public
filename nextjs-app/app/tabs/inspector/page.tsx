import { Metadata } from 'next';
import InspectorA from './InspectorA';

export const metadata: Metadata = {
  title: 'AST Inspector',
};

export default function InspectorWrap() {
  return (
    <div className='w-full pl-3 pt-3'>
      <InspectorA/>
    </div>
  );
}