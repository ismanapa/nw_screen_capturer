import { createStore } from 'redux';
import { toggleRecording } from './index';

import { TOGGLE_RECORDING } from '../Constants';

describe('Action creators', () => {
    describe('toggleRecording', () => {
        it('should return a valid action', () => {
            const FLAG = true,
                action = toggleRecording(FLAG);
            expect(action.payload).toEqual({ toggle: FLAG });
            expect(action.type).toEqual(TOGGLE_RECORDING);
        });
    });
}); 