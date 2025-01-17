import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  username: '',
  gameStarted: false,
  response: {},
  direction: '',
  isLoading: false
};
// this is the different reducers used for the labyrinth,
// using state and action for different parts of the game
const labyrinth = createSlice({
  name: 'game',
  initialState,
  reducers: {
    setUserName: (state, action) => {
      state.username = action.payload;
      console.log('Name, action');
    },
    setDirection: (state, action) => {
      state.direction = action.payload;
    },
    setResponse: (state, action) => {
      state.response = action.payload;
    },
    showGame: (state) => {
      state.gameStarted = true;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    restart: () => {
      return initialState;
    }
  }
});

export default labyrinth;
// this is the progress of the game where we use the responses to set the next step for the player
export const labyrinthProgress = (nextMove) => {
  return (dispatch, getState) => {
    dispatch(labyrinth.actions.setLoading(true));
    dispatch(labyrinth.actions.setResponse({}));
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: getState().labyrinth.username,
        type: 'move',
        direction: getState().labyrinth.direction
      })
    };
    // this is the fetch from the API that we use in the labyrinth-game
    fetch(`https://labyrinth.technigo.io/${nextMove}`, options)
      .then((response) => response.json())
      .then((json) => {
        dispatch(labyrinth.actions.setResponse(json));
        dispatch(labyrinth.actions.setLoading(false));
      })
      .catch((error) => {
        console.log(error);
      });
  };
};