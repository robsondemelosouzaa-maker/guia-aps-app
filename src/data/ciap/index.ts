export type { CiapEntry } from './types';
export { ch_proc_a_b } from './ch_proc_a_b';
export { ch_d_f } from './ch_d_f';
export { ch_h_k } from './ch_h_k';
export { ch_l_n } from './ch_l_n';
export { ch_p_r } from './ch_p_r';
export { ch_s_t } from './ch_s_t';
export { ch_u_w } from './ch_u_w';
export { ch_x_y_z } from './ch_x_y_z';

import { ch_proc_a_b } from './ch_proc_a_b';
import { ch_d_f } from './ch_d_f';
import { ch_h_k } from './ch_h_k';
import { ch_l_n } from './ch_l_n';
import { ch_p_r } from './ch_p_r';
import { ch_s_t } from './ch_s_t';
import { ch_u_w } from './ch_u_w';
import { ch_x_y_z } from './ch_x_y_z';

/** All CIAP-2 entries combined — used by the search page */
export const ALL_CIAP2 = [
    ...ch_proc_a_b,
    ...ch_d_f,
    ...ch_h_k,
    ...ch_l_n,
    ...ch_p_r,
    ...ch_s_t,
    ...ch_u_w,
    ...ch_x_y_z,
];

/** Unique chapter list in display order */
export const CIAP2_CHAPTERS = Array.from(
    new Set(ALL_CIAP2.map(e => e.chapter))
);
