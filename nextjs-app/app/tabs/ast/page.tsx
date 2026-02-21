// @START_RYC3HW0V
import { Metadata } from 'next';
import ASTPage from './App';

export const metadata: Metadata = {
  title: 'UI Creator',
 }

 
export default function EditorWrap() {
    return (
      <div className='w-full pl-3 pt-3'>
        <ASTPage/>
      </div>
// @END_T50SR4CZ
  );
}
