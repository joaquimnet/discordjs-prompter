/**
 * The Prompter object
 */

import { message } from './message';
import { reaction } from './reaction';
import { vote } from './vote';

/**
 * Main Prompter object
 */
const Prompter = {
  /**
   * The message function
   * See [[message]]
   */
  message,
  /**
   * The reaction function
   * See [[reaction]]
   */
  reaction,
  /**
   * The vote function
   * See [[vote]]
   */
  vote,
};

export default Prompter;
module.exports = Prompter;
