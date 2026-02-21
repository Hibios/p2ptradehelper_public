import { Metadata } from 'next';
import PG from './AppIndex';

export const metadata: Metadata = {
  title: 'UI Creator',
 }

 
export default function EditorWrap() {
    return (
      <div className='w-full pl-3 pt-3'>
        <PG/>
      </div>
  );
}
