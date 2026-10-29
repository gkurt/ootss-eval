function word_to_u32(w) {
  let x = 0;
  for (let i = 0; w.$ === "WCon"; i++) {
    x |= Number(w.head) << i;
    w = w.tail;
  }
  return x >>> 0;
}

function u32_to_word(x) {
  let w = {$: "WNil"};
  for (let i = 31; i >= 0; i--) {
    w = {$: "WCon", head: ((x >>> i) & 1) === 1, tail: w};
  }
  return w;
}

function cmp_new(a, b) {
  return {$: a < b ? "LT"
    : a === b ? "EQ" : "GT"};
}

function nat_divmod(a, b) {
  return b === 0 ? {$: "Tuple", fst: 0, snd: a}
    : {$: "Tuple", fst: Math.trunc(a / b), snd: a % b};
}

function nat_chk(n) {
  if (n > 281474976710655) {
    throw "bend: a Nat past the largest immediate 2^48-1";
  }
  return n;
}

function nat_in(n) {
  return Number.isInteger(n) && n >= 0 && n <= 2 ** 53 ? n : nat_chk(1 / 0);
}

function f32_show(x) {
  if (x !== x) {
    return "nan";
  }
  if (!Number.isFinite(x) || Object.is(x, -0)) {
    return x < 0 ? "-inf"
      : x === 0 ? "-0" : "inf";
  }
  let s = "x";
  for (let p = 1; p <= 9 && f32_round(s) !== x; p += 1) {
    s = String(Number(x.toExponential(p - 1)));
  }
  return s;
}

function f32_bits(x) {
  return new Uint32Array(new Float32Array([x]).buffer)[0];
}

function f32_from_bits(u) {
  return new Float32Array(new Uint32Array([u]).buffer)[0];
}

function f32_read(s) {
  const re = /^[\t\n\v\f\r ]*[+-]?((\d+\.?\d*|\.\d+)(e[+-]?\d+)?|inf(inity)?|nan)$/i;
  const v = f32_round(s.replace(/inf\w*/i, "Infinity"));
  return re.test(s) ? {$: "Some", value: v} : {$: "None"};
}

const f32_round = function f32_round(s) {
  const d = Number(s);
  const a = Math.abs(d);
  const f = Math.fround(a);
  const g = 2 * a - Math.min(f, 2 ** 128);
  if (g === f || Math.fround(g) !== g || g === Infinity) {
    return Math.sign(d) * f;
  }
  let k = 0;
  while (a * 2 ** k % 1 !== 0) {
    k += 1;
  }
  const [, i, r, e] = /(\d*)\.?(\d*)(?:e([+-]?\d+))?$/i.exec(s);
  const n = Number(e ?? 0) - r.length;
  const x = BigInt(i + r) * 2n ** BigInt(k) * 10n ** BigInt(Math.max(n, 0));
  const y = BigInt(a * 2 ** k) * 10n ** BigInt(Math.max(-n, 0));
  return Math.sign(d) * (x === y || x > y !== g > f ? f : g);
};

function char_new(code) {
  if (code > 0x10FFFF || (code >= 0xD800 && code <= 0xDFFF)) {
    throw "bend: " + code + " is not a Unicode scalar value";
  }
  return String.fromCodePoint(code);
}

// Array
// =====

function array_new(d, v) {
  if (d > 31) {
    throw "bend: an array past the deepest block class 31";
  }
  return Array(2 ** d).fill(v);
}

function array_node(a, b) {
  if (a.length !== b.length) {
    throw "bend: runtime fail-stop";
  }
  return a.concat(b);
}

function array_rmw(a, i, f) {
  const at = i % a.length;
  const old = a[at];
  a[at] = f(old);
  return {$: "Tuple", fst: a, snd: old};
}

// Run
// ===

function run_tail(f, x) {
  return {$: "$JMP", f: f.j?.f === f ? f.j : f, x};
}

function run_clo(j) {
  const f = (x) => run_loop(j(x));
  f.j = j;
  j.f = f;
  return f;
}

function run_loop(r) {
  while (r !== null && typeof r === "object" && r.$ === "$JMP") {
    r = r.f(r.x);
  }
  return r;
}

function run_lib(f, n) {
  return (...a) => a.length < n ? run_lib((...b) => f(...a, ...b), n - a.length)
    : run_loop(f(...a));
}

// Effect
// ======

const $0eff = Object.create(null);

function io_eff(k, run) {
  if (arguments.length > 2) {
    throw new Error("bend: " + k + " takes no need: an effect that waits parks itself");
  }
  if (k in $0eff) {
    throw new Error("bend: two effects register " + k);
  }
  $0eff[k] = run;
}
// Program
// =======

function $pick$(_c_0, _a_0, _b_0) {
  if (_c_0) {
    return _a_0;
  } else {
    return _b_0;
  }
}

function $nat_eq$($0, $1) {
  for (;;) {
    {
      const _a_0 = $0;
      const _b_0 = $1;
      if (_a_0 === 0) {
        if (_b_0 === 0) {
          return true;
        } else {
          return false;
        }
      } else {
        const _p_0 = (_a_0 - 1);
        if (_b_0 === 0) {
          return false;
        } else {
          const _q_1 = (_b_0 - 1);
          $0 = _p_0;
          $1 = _q_1;
          continue;
        }
      }
    }
  }
}

function $nat_lt$($0, $1) {
  for (;;) {
    {
      const _a_0 = $0;
      const _b_0 = $1;
      if (_a_0 === 0) {
        if (_b_0 === 0) {
          return false;
        } else {
          return true;
        }
      } else {
        const _p_0 = (_a_0 - 1);
        if (_b_0 === 0) {
          return false;
        } else {
          const _q_1 = (_b_0 - 1);
          $0 = _p_0;
          $1 = _q_1;
          continue;
        }
      }
    }
  }
}

function $nat_le$(_a_0, _b_0) {
  return $nat_lt$(_a_0, nat_chk(_b_0 + 1));
}

function $nat_dist$(_a_0, _b_0) {
  const _x_0 = (_a_0 < _b_0 ? 0 : _a_0 - _b_0);
  const _x_1 = (_b_0 < _a_0 ? 0 : _b_0 - _a_0);
  return nat_chk(_x_0 + _x_1);
}

function $bool_eq$(_a_0, _b_0) {
  if (_a_0) {
    if (_b_0) {
      return true;
    } else {
      return false;
    }
  } else {
    if (!_b_0) {
      return true;
    } else {
      return false;
    }
  }
}

function $pos_eq$(_a_0, _b_0) {
  const _ac_0 = _a_0["c"];
  const _ar_0 = _a_0["r"];
  const _az_0 = _a_0["z"];
  const _bc_0 = _b_0["c"];
  const _br_0 = _b_0["r"];
  const _bz_0 = _b_0["z"];
  return $Bool$and$(($Bool$and$(($nat_eq$(_ac_0, _bc_0)), ($nat_eq$(_ar_0, _br_0)))), ($nat_eq$(_az_0, _bz_0)));
}

function $dir_eq$(_a_0, _b_0) {
  if (_a_0.$ === "DN") {
    if (_b_0.$ === "DN") {
      return true;
    } else {
      return false;
    }
  } else if (_a_0.$ === "DE") {
    if (_b_0.$ === "DE") {
      return true;
    } else {
      return false;
    }
  } else if (_a_0.$ === "DS") {
    if (_b_0.$ === "DS") {
      return true;
    } else {
      return false;
    }
  } else if (_a_0.$ === "DW") {
    if (_b_0.$ === "DW") {
      return true;
    } else {
      return false;
    }
  } else if (_a_0.$ === "DUp") {
    if (_b_0.$ === "DUp") {
      return true;
    } else {
      return false;
    }
  } else {
    if (_b_0.$ === "DDown") {
      return true;
    } else {
      return false;
    }
  }
}

function $step$(_d_0, _p_0) {
  if (_d_0.$ === "DN") {
    const _c_0 = _p_0["c"];
    const _r_0 = _p_0["r"];
    const _z_0 = _p_0["z"];
    return {$: "Pos", "c": _c_0, "r": (_r_0 < 1 ? 0 : _r_0 - 1), "z": _z_0};
  } else if (_d_0.$ === "DS") {
    const _c_1 = _p_0["c"];
    const _r_1 = _p_0["r"];
    const _z_1 = _p_0["z"];
    return {$: "Pos", "c": _c_1, "r": nat_chk(_r_1 + 1), "z": _z_1};
  } else if (_d_0.$ === "DW") {
    const _c_2 = _p_0["c"];
    const _r_2 = _p_0["r"];
    const _z_2 = _p_0["z"];
    return {$: "Pos", "c": (_c_2 < 1 ? 0 : _c_2 - 1), "r": _r_2, "z": _z_2};
  } else if (_d_0.$ === "DE") {
    const _c_3 = _p_0["c"];
    const _r_3 = _p_0["r"];
    const _z_3 = _p_0["z"];
    return {$: "Pos", "c": nat_chk(_c_3 + 1), "r": _r_3, "z": _z_3};
  } else if (_d_0.$ === "DUp") {
    const _c_4 = _p_0["c"];
    const _r_4 = _p_0["r"];
    const _z_4 = _p_0["z"];
    return {$: "Pos", "c": _c_4, "r": _r_4, "z": nat_chk(_z_4 + 1)};
  } else {
    const _c_5 = _p_0["c"];
    const _r_5 = _p_0["r"];
    const _z_5 = _p_0["z"];
    return {$: "Pos", "c": _c_5, "r": _r_5, "z": (_z_5 < 1 ? 0 : _z_5 - 1)};
  }
}

function $flip$(_d_0) {
  if (_d_0.$ === "DN") {
    return {$: "DS"};
  } else if (_d_0.$ === "DS") {
    return {$: "DN"};
  } else if (_d_0.$ === "DE") {
    return {$: "DW"};
  } else if (_d_0.$ === "DW") {
    return {$: "DE"};
  } else if (_d_0.$ === "DUp") {
    return {$: "DDown"};
  } else {
    return {$: "DUp"};
  }
}

function $cw$(_d_0) {
  if (_d_0.$ === "DN") {
    return {$: "DE"};
  } else if (_d_0.$ === "DE") {
    return {$: "DS"};
  } else if (_d_0.$ === "DS") {
    return {$: "DW"};
  } else if (_d_0.$ === "DW") {
    return {$: "DN"};
  } else if (_d_0.$ === "DUp") {
    return {$: "DUp"};
  } else {
    return {$: "DDown"};
  }
}

function $opposite$(_a_0, _b_0) {
  return $dir_eq$(($flip$(_a_0)), _b_0);
}

function $pos_c$(_p_0) {
  const _c_0 = _p_0["c"];
  return _c_0;
}

function $pos_r$(_p_0) {
  const _r_0 = _p_0["r"];
  return _r_0;
}

function $pos_z$(_p_0) {
  const _z_0 = _p_0["z"];
  return _z_0;
}

function $adjacent$(_a_0, _b_0) {
  const _ac_0 = _a_0["c"];
  const _ar_0 = _a_0["r"];
  const _az_0 = _a_0["z"];
  const _bc_0 = _b_0["c"];
  const _br_0 = _b_0["r"];
  const _bz_0 = _b_0["z"];
  const _x_0 = ($nat_dist$(_ac_0, _bc_0));
  const _x_1 = ($nat_dist$(_ar_0, _br_0));
  const _x_2 = nat_chk(_x_0 + _x_1);
  const _x_3 = ($nat_dist$(_az_0, _bz_0));
  return $nat_eq$(nat_chk(_x_2 + _x_3), 1);
}

function $chebyshev_le2$(_a_0, _b_0) {
  const _ac_0 = _a_0["c"];
  const _ar_0 = _a_0["r"];
  const _az_0 = _a_0["z"];
  const _bc_0 = _b_0["c"];
  const _br_0 = _b_0["r"];
  const _bz_0 = _b_0["z"];
  return $Bool$and$(($Bool$and$(($nat_le$(($nat_dist$(_ac_0, _bc_0)), 2)), ($nat_le$(($nat_dist$(_ar_0, _br_0)), 2)))), ($nat_le$(($nat_dist$(_az_0, _bz_0)), 2)));
}

function $row_at$($0, $1) {
  for (;;) {
    {
      const _rows_0 = $0;
      const _r_0 = $1;
      if (_rows_0.$ === "Nil") {
        return {$: "Nil"};
      } else {
        const _x_0 = _rows_0["head"];
        const _xs_0 = _rows_0["tail"];
        if (_r_0 === 0) {
          return _x_0;
        } else {
          const _q_0 = (_r_0 - 1);
          $0 = _xs_0;
          $1 = _q_0;
          continue;
        }
      }
    }
  }
}

function $tile_in$($0, $1) {
  for (;;) {
    {
      const _row_0 = $0;
      const _c_0 = $1;
      if (_row_0.$ === "Nil") {
        return {$: "TSolid"};
      } else {
        const _t_0 = _row_0["head"];
        const _ts_0 = _row_0["tail"];
        if (_c_0 === 0) {
          return _t_0;
        } else {
          const _q_0 = (_c_0 - 1);
          $0 = _ts_0;
          $1 = _q_0;
          continue;
        }
      }
    }
  }
}

function $bool_row$($0, $1) {
  for (;;) {
    {
      const _rows_0 = $0;
      const _r_0 = $1;
      if (_rows_0.$ === "Nil") {
        return {$: "Nil"};
      } else {
        const _x_0 = _rows_0["head"];
        const _xs_0 = _rows_0["tail"];
        if (_r_0 === 0) {
          return _x_0;
        } else {
          const _q_0 = (_r_0 - 1);
          $0 = _xs_0;
          $1 = _q_0;
          continue;
        }
      }
    }
  }
}

function $bool_in$($0, $1) {
  for (;;) {
    {
      const _row_0 = $0;
      const _c_0 = $1;
      if (_row_0.$ === "Nil") {
        return false;
      } else {
        const _t_0 = _row_0["head"];
        const _ts_0 = _row_0["tail"];
        if (_c_0 === 0) {
          return _t_0;
        } else {
          const _q_0 = (_c_0 - 1);
          $0 = _ts_0;
          $1 = _q_0;
          continue;
        }
      }
    }
  }
}

function $tile_of$(_k_0) {
  return $pick$((_k_0 === 87), {$: "TWall"}, ($pick$((_k_0 === 70), {$: "TFloor"}, ($pick$((_k_0 === 65), {$: "TWater"}, {$: "TSolid"})))));
}

function $tile_row_of$(_s_0) {
  if (_s_0 === "") {
    return {$: "Nil"};
  } else {
    const _t_0 = (_s_0.codePointAt(0) > 0xFFFF ? _s_0.slice(0, 2) : _s_0[0]);
    const _rest_0 = (_s_0.codePointAt(0) > 0xFFFF ? _s_0.slice(2) : _s_0.slice(1));
    return {$: "Con", "head": ($tile_of$(_t_0.codePointAt(0))), "tail": ($tile_row_of$(_rest_0))};
  }
}

function $tiles_of$(_rows_0) {
  if (_rows_0.$ === "Nil") {
    return {$: "Nil"};
  } else {
    const _r_0 = _rows_0["head"];
    const _rest_0 = _rows_0["tail"];
    return {$: "Con", "head": ($tile_row_of$(_r_0)), "tail": ($tiles_of$(_rest_0))};
  }
}

function $top_row_of$(_s_0) {
  if (_s_0 === "") {
    return {$: "Nil"};
  } else {
    const _t_0 = (_s_0.codePointAt(0) > 0xFFFF ? _s_0.slice(0, 2) : _s_0[0]);
    const _rest_0 = (_s_0.codePointAt(0) > 0xFFFF ? _s_0.slice(2) : _s_0.slice(1));
    const _x_0 = _t_0.codePointAt(0);
    return {$: "Con", "head": (_x_0 === 35), "tail": ($top_row_of$(_rest_0))};
  }
}

function $top_of$(_rows_0) {
  if (_rows_0.$ === "Nil") {
    return {$: "Nil"};
  } else {
    const _r_0 = _rows_0["head"];
    const _rest_0 = _rows_0["tail"];
    return {$: "Con", "head": ($top_row_of$(_r_0)), "tail": ($top_of$(_rest_0))};
  }
}

function $tile$(_lv_0, _c_0, _r_0) {
  const _tiles_0 = _lv_0["tiles"];
  return $tile_in$(($row_at$(_tiles_0, _r_0)), _c_0);
}

function $top_wall$(_lv_0, _c_0, _r_0) {
  const _top_0 = _lv_0["top"];
  return $bool_in$(($bool_row$(_top_0, _r_0)), _c_0);
}

function $is_solid_tile$(_t_0) {
  if (_t_0.$ === "TSolid") {
    return true;
  } else {
    return false;
  }
}

function $is_wall_tile$(_t_0) {
  if (_t_0.$ === "TWall") {
    return true;
  } else if (_t_0.$ === "TSolid") {
    return true;
  } else {
    return false;
  }
}

function $is_ground_tile$(_t_0) {
  if (_t_0.$ === "TWater") {
    return false;
  } else {
    return true;
  }
}

function $is_water_tile$(_t_0) {
  if (_t_0.$ === "TWater") {
    return true;
  } else {
    return false;
  }
}

function $wall_z$(_z_0, _lv_0, _c_0, _r_0) {
  if (_z_0 === 0) {
    return true;
  } else if (_z_0 === 1) {
    return $is_ground_tile$(($tile$(_lv_0, _c_0, _r_0)));
  } else if (_z_0 === 2) {
    return $is_wall_tile$(($tile$(_lv_0, _c_0, _r_0)));
  } else if (_z_0 === 3) {
    const _x_0 = ($is_solid_tile$(($tile$(_lv_0, _c_0, _r_0))));
    const _x_1 = ($top_wall$(_lv_0, _c_0, _r_0));
    return (_x_0 || _x_1);
  } else {
    return $is_solid_tile$(($tile$(_lv_0, _c_0, _r_0)));
  }
}

function $wall$(_lv_0, _p_0) {
  const _c_0 = _p_0["c"];
  const _r_0 = _p_0["r"];
  const _z_0 = _p_0["z"];
  return $wall_z$(_z_0, _lv_0, _c_0, _r_0);
}

function $water$(_lv_0, _p_0) {
  const _c_0 = _p_0["c"];
  const _r_0 = _p_0["r"];
  return $is_water_tile$(($tile$(_lv_0, _c_0, _r_0)));
}

function $fence_hit$(_fs_0, _start_0, _nxt_0, _d_0) {
  if (_fs_0.$ === "Nil") {
    return false;
  } else {
    const _t_0 = _fs_0["head"];
    const _c_0 = _t_0["c"];
    const _r_0 = _t_0["r"];
    const _e_0 = _t_0["edge"];
    const _rest_0 = _fs_0["tail"];
    const _here_0 = ($Bool$and$(($nat_eq$(_c_0, ($pos_c$(_start_0)))), ($nat_eq$(_r_0, ($pos_r$(_start_0))))));
    const _there_0 = ($Bool$and$(($nat_eq$(_c_0, ($pos_c$(_nxt_0)))), ($nat_eq$(_r_0, ($pos_r$(_nxt_0))))));
    const _x_0 = ($Bool$and$(_here_0, ($dir_eq$(_e_0, _d_0))));
    const _x_1 = ($Bool$and$(_there_0, ($opposite$(_e_0, _d_0))));
    const _x_2 = (_x_0 || _x_1);
    const _x_3 = ($fence_hit$(_rest_0, _start_0, _nxt_0, _d_0));
    return (_x_2 || _x_3);
  }
}

function $is_planar$(_d_0) {
  if (_d_0.$ === "DUp") {
    return false;
  } else if (_d_0.$ === "DDown") {
    return false;
  } else {
    return true;
  }
}

function $fence_blocks$(_lv_0, _start_0, _d_0) {
  const _fs_0 = _lv_0["fences"];
  return $Bool$and$(($is_planar$(_d_0)), ($fence_hit$(_fs_0, _start_0, ($step$(_d_0, _start_0)), _d_0)));
}

function $ent_id$(_e_0) {
  const _i_0 = _e_0["id"];
  return _i_0;
}

function $ent_at$(_e_0) {
  const _p_0 = _e_0["at"];
  return _p_0;
}

function $ent_dead$(_e_0) {
  const _dd_0 = _e_0["dead"];
  return _dd_0;
}

function $ent_kind$(_e_0) {
  const _k_0 = _e_0["kind"];
  return _k_0;
}

function $is_guy_kind$(_k_0) {
  if (_k_0.$ === "Guy") {
    return true;
  } else {
    return false;
  }
}

function $is_monster_kind$(_k_0) {
  if (_k_0.$ === "Monster") {
    return true;
  } else {
    return false;
  }
}

function $is_tree_kind$(_k_0) {
  if (_k_0.$ === "Tree") {
    return true;
  } else {
    return false;
  }
}

function $is_sign_kind$(_k_0) {
  if (_k_0.$ === "Sign") {
    return true;
  } else {
    return false;
  }
}

function $is_mirror_kind$(_k_0) {
  if (_k_0.$ === "Mirror") {
    return true;
  } else {
    return false;
  }
}

function $is_rock_kind$(_k_0) {
  if (_k_0.$ === "Rock") {
    return true;
  } else {
    return false;
  }
}

function $is_movable_kind$(_k_0) {
  if (_k_0.$ === "Tree") {
    return false;
  } else if (_k_0.$ === "Sign") {
    return false;
  } else {
    return true;
  }
}

function $is_blocker_kind$(_k_0) {
  if (_k_0.$ === "Tree") {
    return true;
  } else if (_k_0.$ === "Sign") {
    return true;
  } else {
    return false;
  }
}

function $is_movable$(_e_0) {
  return $Bool$and$(($Bool$not$(($ent_dead$(_e_0)))), ($is_movable_kind$(($ent_kind$(_e_0)))));
}

function $is_guy$(_e_0) {
  return $is_guy_kind$(($ent_kind$(_e_0)));
}

function $guy_group$(_e_0) {
  const _t_0 = _e_0["kind"];
  if (_t_0.$ === "Guy") {
    const _g_0 = _t_0["group"];
    return _g_0;
  } else {
    return 0;
  }
}

function $guy_order$(_e_0) {
  const _t_0 = _e_0["kind"];
  if (_t_0.$ === "Guy") {
    const _o_0 = _t_0["order"];
    return _o_0;
  } else {
    return 0;
  }
}

function $guy_role$(_e_0) {
  const _t_0 = _e_0["kind"];
  if (_t_0.$ === "Guy") {
    const _ro_0 = _t_0["role"];
    return _ro_0;
  } else {
    return {$: "Warrior"};
  }
}

function $role_is$(_r_0, _s_0) {
  if (_r_0.$ === "Warrior") {
    if (_s_0.$ === "Warrior") {
      return true;
    } else {
      return false;
    }
  } else if (_r_0.$ === "Thief") {
    if (_s_0.$ === "Thief") {
      return true;
    } else {
      return false;
    }
  } else if (_r_0.$ === "Wizard") {
    if (_s_0.$ === "Wizard") {
      return true;
    } else {
      return false;
    }
  } else if (_r_0.$ === "Cleric") {
    if (_s_0.$ === "Cleric") {
      return true;
    } else {
      return false;
    }
  } else if (_r_0.$ === "Bard") {
    if (_s_0.$ === "Bard") {
      return true;
    } else {
      return false;
    }
  } else if (_r_0.$ === "Druid") {
    if (_s_0.$ === "Druid") {
      return true;
    } else {
      return false;
    }
  } else if (_r_0.$ === "Trader") {
    if (_s_0.$ === "Trader") {
      return true;
    } else {
      return false;
    }
  } else {
    if (_s_0.$ === "Queen") {
      return true;
    } else {
      return false;
    }
  }
}

function $find$(_es_0, _i_0) {
  if (_es_0.$ === "Nil") {
    return {$: "None"};
  } else {
    const _e_0 = _es_0["head"];
    const _rest_0 = _es_0["tail"];
    return $pick$(($nat_eq$(($ent_id$(_e_0)), _i_0)), {$: "Some", "value": _e_0}, ($find$(_rest_0, _i_0)));
  }
}

function $at$(_es_0, _p_0) {
  if (_es_0.$ === "Nil") {
    return {$: "Nil"};
  } else {
    const _e_0 = _es_0["head"];
    const _rest_0 = _es_0["tail"];
    const _tl_0 = ($at$(_rest_0, _p_0));
    return $pick$(($Bool$and$(($pos_eq$(($ent_at$(_e_0)), _p_0)), ($Bool$not$(($ent_dead$(_e_0)))))), {$: "Con", "head": _e_0, "tail": _tl_0}, _tl_0);
  }
}

function $set_ent$(_es_0, _n_0) {
  if (_es_0.$ === "Nil") {
    return {$: "Nil"};
  } else {
    const _e_0 = _es_0["head"];
    const _rest_0 = _es_0["tail"];
    return $pick$(($nat_eq$(($ent_id$(_e_0)), ($ent_id$(_n_0)))), {$: "Con", "head": _n_0, "tail": _rest_0}, {$: "Con", "head": _e_0, "tail": ($set_ent$(_rest_0, _n_0))});
  }
}

function $remove_ent$(_es_0, _i_0) {
  if (_es_0.$ === "Nil") {
    return {$: "Nil"};
  } else {
    const _e_0 = _es_0["head"];
    const _rest_0 = _es_0["tail"];
    return $pick$(($nat_eq$(($ent_id$(_e_0)), _i_0)), _rest_0, {$: "Con", "head": _e_0, "tail": ($remove_ent$(_rest_0, _i_0))});
  }
}

function $insert_ent$(_es_0, _n_0) {
  if (_es_0.$ === "Nil") {
    return {$: "Con", "head": _n_0, "tail": {$: "Nil"}};
  } else {
    const _e_0 = _es_0["head"];
    const _rest_0 = _es_0["tail"];
    return $pick$(($nat_lt$(($ent_id$(_n_0)), ($ent_id$(_e_0)))), {$: "Con", "head": _n_0, "tail": {$: "Con", "head": _e_0, "tail": _rest_0}}, {$: "Con", "head": _e_0, "tail": ($insert_ent$(_rest_0, _n_0))});
  }
}

function $max_id$($0, $1) {
  for (;;) {
    {
      const _es_0 = $0;
      const _acc_0 = $1;
      if (_es_0.$ === "Nil") {
        return _acc_0;
      } else {
        const _e_0 = _es_0["head"];
        const _rest_0 = _es_0["tail"];
        const _i_0 = ($ent_id$(_e_0));
        $0 = _rest_0;
        $1 = ($pick$(($nat_lt$(_acc_0, _i_0)), _i_0, _acc_0));
        continue;
      }
    }
  }
}

function $move_ent$(_e_0, _p_0) {
  const _i_0 = _e_0["id"];
  const _k_0 = _e_0["kind"];
  const _dd_0 = _e_0["dead"];
  return {$: "Ent", "id": _i_0, "kind": _k_0, "at": _p_0, "dead": _dd_0};
}

function $kill_ent$(_e_0) {
  const _i_0 = _e_0["id"];
  const _k_0 = _e_0["kind"];
  const _q_0 = _e_0["at"];
  return {$: "Ent", "id": _i_0, "kind": _k_0, "at": _q_0, "dead": true};
}

function $gate_open_at$($0, $1) {
  for (;;) {
    {
      const _gs_0 = $0;
      const _n_0 = $1;
      if (_gs_0.$ === "Nil") {
        return false;
      } else {
        const _g_0 = _gs_0["head"];
        const _rest_0 = _gs_0["tail"];
        if (_n_0 === 0) {
          return _g_0;
        } else {
          const _q_0 = (_n_0 - 1);
          $0 = _rest_0;
          $1 = _q_0;
          continue;
        }
      }
    }
  }
}

function $gate_index$(_gs_0, _p_0, _i_0) {
  if (_gs_0.$ === "Nil") {
    return {$: "None"};
  } else {
    const _t_0 = _gs_0["head"];
    const _q_0 = _t_0["at"];
    const _rest_0 = _gs_0["tail"];
    return $pick$(($pos_eq$(_q_0, _p_0)), {$: "Some", "value": _i_0}, ($gate_index$(_rest_0, _p_0, nat_chk(_i_0 + 1))));
  }
}

function $gs_lookup$(_xs_0, _i_0) {
  if (_xs_0.$ === "Nil") {
    return {$: "None"};
  } else {
    const _t_0 = _xs_0["head"];
    const _j_0 = _t_0["ix"];
    const _o_0 = _t_0["open"];
    const _rest_0 = _xs_0["tail"];
    return $pick$(($nat_eq$(_j_0, _i_0)), {$: "Some", "value": _o_0}, ($gs_lookup$(_rest_0, _i_0)));
  }
}

function $gs_drop$(_xs_0, _i_0) {
  if (_xs_0.$ === "Nil") {
    return {$: "Nil"};
  } else {
    const _t_0 = _xs_0["head"];
    const _j_0 = _t_0["ix"];
    const _o_0 = _t_0["open"];
    const _rest_0 = _xs_0["tail"];
    const _tl_0 = ($gs_drop$(_rest_0, _i_0));
    return $pick$(($nat_eq$(_j_0, _i_0)), _tl_0, {$: "Con", "head": {$: "GS", "ix": _j_0, "open": _o_0}, "tail": _tl_0});
  }
}

function $closed_at_index$(_m_0, _gs_0, _tg_0) {
  if (_m_0.$ === "None") {
    return false;
  } else {
    const _i_0 = _m_0["value"];
    return $Bool$not$(($Maybe$default$(($gs_lookup$(_tg_0, _i_0)), ($gate_open_at$(_gs_0, _i_0)))));
  }
}

function $closed_gate$(_lv_0, _gs_0, _tg_0, _p_0) {
  const _gates_0 = _lv_0["gates"];
  return $closed_at_index$(($gate_index$(_gates_0, _p_0, 0)), _gs_0, _tg_0);
}

function $mv_has$(_ms_0, _i_0) {
  if (_ms_0.$ === "Nil") {
    return false;
  } else {
    const _t_0 = _ms_0["head"];
    const _j_0 = _t_0["id"];
    const _rest_0 = _ms_0["tail"];
    const _x_0 = ($nat_eq$(_j_0, _i_0));
    const _x_1 = ($mv_has$(_rest_0, _i_0));
    return (_x_0 || _x_1);
  }
}

function $mv_get$(_ms_0, _i_0) {
  if (_ms_0.$ === "Nil") {
    return {$: "None"};
  } else {
    const _t_0 = _ms_0["head"];
    const _j_0 = _t_0["id"];
    const _q_0 = _t_0["to"];
    const _rest_0 = _ms_0["tail"];
    return $pick$(($nat_eq$(_j_0, _i_0)), {$: "Some", "value": _q_0}, ($mv_get$(_rest_0, _i_0)));
  }
}

function $mv_put$(_ms_0, _i_0, _p_0) {
  if (_ms_0.$ === "Nil") {
    return {$: "Con", "head": {$: "Mv", "id": _i_0, "to": _p_0}, "tail": {$: "Nil"}};
  } else {
    const _t_0 = _ms_0["head"];
    const _j_0 = _t_0["id"];
    const _q_0 = _t_0["to"];
    const _rest_0 = _ms_0["tail"];
    return $pick$(($nat_eq$(_j_0, _i_0)), {$: "Con", "head": {$: "Mv", "id": _i_0, "to": _p_0}, "tail": _rest_0}, {$: "Con", "head": {$: "Mv", "id": _j_0, "to": _q_0}, "tail": ($mv_put$(_rest_0, _i_0, _p_0))});
  }
}

function $alive_id$(_es_0, _i_0) {
  if (_es_0.$ === "Nil") {
    return false;
  } else {
    const _e_0 = _es_0["head"];
    const _rest_0 = _es_0["tail"];
    const _x_0 = ($Bool$and$(($nat_eq$(($ent_id$(_e_0)), _i_0)), ($Bool$not$(($ent_dead$(_e_0))))));
    const _x_1 = ($alive_id$(_rest_0, _i_0));
    return (_x_0 || _x_1);
  }
}

function $mv_into$(_ms_0, _es_0, _p_0, _me_0) {
  if (_ms_0.$ === "Nil") {
    return false;
  } else {
    const _t_0 = _ms_0["head"];
    const _j_0 = _t_0["id"];
    const _q_0 = _t_0["to"];
    const _rest_0 = _ms_0["tail"];
    const _hit_0 = ($Bool$and$(($pos_eq$(_q_0, _p_0)), ($Bool$not$(($nat_eq$(_j_0, _me_0))))));
    const _x_0 = ($Bool$and$(_hit_0, ($alive_id$(_es_0, _j_0))));
    const _x_1 = ($mv_into$(_rest_0, _es_0, _p_0, _me_0));
    return (_x_0 || _x_1);
  }
}

function $empty_txn$(_k_0) {
  return {$: "Txn", "kind": _k_0, "moves": {$: "Nil"}, "kills": {$: "Nil"}, "merges": {$: "Nil"}, "repl": {$: "Nil"}, "news": {$: "Nil"}, "gates": {$: "Nil"}};
}

function $txn_moves$(_t_0) {
  const _ms_0 = _t_0["moves"];
  return _ms_0;
}

function $txn_with_moves$(_t_0, _ms_0) {
  const _k_0 = _t_0["kind"];
  const _ks_0 = _t_0["kills"];
  const _mg_0 = _t_0["merges"];
  const _rp_0 = _t_0["repl"];
  const _nw_0 = _t_0["news"];
  const _gs_0 = _t_0["gates"];
  return {$: "Txn", "kind": _k_0, "moves": _ms_0, "kills": _ks_0, "merges": _mg_0, "repl": _rp_0, "news": _nw_0, "gates": _gs_0};
}

function $list_empty$(_xs_0) {
  if (_xs_0.$ === "Nil") {
    return true;
  } else {
    return false;
  }
}

function $txn_empty$(_t_0) {
  const _ms_0 = _t_0["moves"];
  const _ks_0 = _t_0["kills"];
  const _mg_0 = _t_0["merges"];
  const _rp_0 = _t_0["repl"];
  const _nw_0 = _t_0["news"];
  const _gs_0 = _t_0["gates"];
  return $Bool$and$(($Bool$and$(($Bool$and$(($list_empty$(_ms_0)), ($list_empty$(_ks_0)))), ($Bool$and$(($list_empty$(_mg_0)), ($list_empty$(_rp_0)))))), ($Bool$and$(($list_empty$(_nw_0)), ($list_empty$(_gs_0)))));
}

function $st_ents$(_st_0) {
  const _es_0 = _st_0["ents"];
  return _es_0;
}

function $st_gates$(_st_0) {
  const _gs_0 = _st_0["gates"];
  return _gs_0;
}

function $st_sel$(_st_0) {
  const _sel_0 = _st_0["sel"];
  return _sel_0;
}

function $nat_in$(_xs_0, _i_0) {
  if (_xs_0.$ === "Nil") {
    return false;
  } else {
    const _x_0 = _xs_0["head"];
    const _rest_0 = _xs_0["tail"];
    const _x_1 = ($nat_eq$(_x_0, _i_0));
    const _x_2 = ($nat_in$(_rest_0, _i_0));
    return (_x_1 || _x_2);
  }
}

function $is_some_nat$(_m_0, _i_0) {
  if (_m_0.$ === "None") {
    return false;
  } else {
    const _j_0 = _m_0["value"];
    return $nat_eq$(_j_0, _i_0);
  }
}

function $is_own_gate$(_m_0, _p_0) {
  if (_m_0.$ === "None") {
    return false;
  } else {
    const _q_0 = _m_0["value"];
    return $pos_eq$(_q_0, _p_0);
  }
}

function $cell_ok$(_lv_0, _st_0, _t_0, _me_0, _start_0, _tgt_0, _d_0, _fences_0, _own_0) {
  const _es_0 = _st_0["ents"];
  const _gs_0 = _st_0["gates"];
  const _ms_0 = _t_0["moves"];
  const _tg_0 = _t_0["gates"];
  const _b1_0 = ($Bool$not$(($mv_into$(_ms_0, _es_0, _tgt_0, _me_0))));
  const _b2_0 = ($Bool$not$(($Bool$and$(_fences_0, ($fence_blocks$(_lv_0, _start_0, _d_0))))));
  const _b3_0 = ($Bool$not$(($wall$(_lv_0, _tgt_0))));
  const _x_0 = ($is_own_gate$(_own_0, _tgt_0));
  const _x_1 = ($Bool$not$(($closed_gate$(_lv_0, _gs_0, _tg_0, _tgt_0))));
  const _b4_0 = (_x_0 || _x_1);
  return $Bool$and$(($Bool$and$(_b1_0, _b2_0)), ($Bool$and$(_b3_0, _b4_0)));
}

function $frame_cell$(_f_0) {
  const _c_0 = _f_0["cell"];
  return _c_0;
}

function $push_occupant$(_o_0, _lv_0, _st_0, _t_0, _I_0, _d_0, _fences_0, _mover_0, _cell_0, _rest_0, _frames_0, _plist_0) {
  const _oid_0 = ($ent_id$(_o_0));
  const _k_0 = ($ent_kind$(_o_0));
  const _nxt_0 = ($step$(_d_0, _cell_0));
  const _inmv_0 = ($mv_has$(($txn_moves$(_t_0)), _oid_0));
  const _x_0 = ($nat_eq$(_oid_0, _mover_0));
  const _skip_0 = (_x_0 || _inmv_0);
  const _is_i_0 = ($is_some_nat$(_I_0, _oid_0));
  const _pl_0 = _plist_0;
  const _x_1 = ($is_blocker_kind$(_k_0));
  const _x_2 = ($nat_in$(_pl_0, _oid_0));
  return $pick$(_skip_0, {$: "PStep", "done": false, "ok": true, "stack": {$: "Con", "head": {$: "Frame", "mover": _mover_0, "cell": _cell_0, "rest": _rest_0}, "tail": _frames_0}, "plist": _pl_0}, ($pick$(_is_i_0, {$: "PStep", "done": false, "ok": true, "stack": _frames_0, "plist": _pl_0}, ($pick$((_x_1 || _x_2), {$: "PStep", "done": true, "ok": false, "stack": {$: "Nil"}, "plist": _pl_0}, ($pick$(($cell_ok$(_lv_0, _st_0, _t_0, _oid_0, _cell_0, _nxt_0, _d_0, _fences_0, {$: "None"})), {$: "PStep", "done": false, "ok": true, "stack": {$: "Con", "head": {$: "Frame", "mover": _oid_0, "cell": _nxt_0, "rest": ($at$(($st_ents$(_st_0)), _nxt_0))}, "tail": {$: "Con", "head": {$: "Frame", "mover": _mover_0, "cell": _cell_0, "rest": _rest_0}, "tail": _frames_0}}, "plist": ($List$append$(_pl_0, {$: "Con", "head": _oid_0, "tail": {$: "Nil"}}))}, {$: "PStep", "done": true, "ok": false, "stack": {$: "Nil"}, "plist": ($List$append$(_pl_0, {$: "Con", "head": _oid_0, "tail": {$: "Nil"}}))})))))));
}

function $push_frame$(_f_0, _lv_0, _st_0, _t_0, _I_0, _d_0, _fences_0, _frames_0, _plist_0) {
  const _mover_0 = _f_0["mover"];
  const _cell_0 = _f_0["cell"];
  const _t_1 = _f_0["rest"];
  if (_t_1.$ === "Nil") {
    return {$: "PStep", "done": false, "ok": true, "stack": _frames_0, "plist": _plist_0};
  } else {
    const _o_0 = _t_1["head"];
    const _rest_0 = _t_1["tail"];
    return $push_occupant$(_o_0, _lv_0, _st_0, _t_0, _I_0, _d_0, _fences_0, _mover_0, _cell_0, _rest_0, _frames_0, _plist_0);
  }
}

function $push_loop$($0, $1, $2, $3, $4, $5, $6, $7) {
  for (;;) {
    {
      const _fuel_0 = $0;
      const _lv_0 = $1;
      const _st_0 = $2;
      const _t_0 = $3;
      const _I_0 = $4;
      const _d_0 = $5;
      const _fences_0 = $6;
      const _ps_0 = $7;
      if (_fuel_0 === 0) {
        const _pl_0 = _ps_0["plist"];
        return {$: "PR", "ok": false, "plist": _pl_0};
      } else {
        const _f_0 = (_fuel_0 - 1);
        const _t_1 = _ps_0["done"];
        if (_t_1) {
          const _ok_1 = _ps_0["ok"];
          const _pl_1 = _ps_0["plist"];
          return {$: "PR", "ok": _ok_1, "plist": _pl_1};
        } else {
          const _t_2 = _ps_0["stack"];
          if (_t_2.$ === "Nil") {
            const _pl_2 = _ps_0["plist"];
            return {$: "PR", "ok": true, "plist": _pl_2};
          } else {
            const _fr_0 = _t_2["head"];
            const _frames_0 = _t_2["tail"];
            const _pl_3 = _ps_0["plist"];
            $0 = _f_0;
            $1 = _lv_0;
            $2 = _st_0;
            $3 = _t_0;
            $4 = _I_0;
            $5 = _d_0;
            $6 = _fences_0;
            $7 = ($push_frame$(_fr_0, _lv_0, _st_0, _t_0, _I_0, _d_0, _fences_0, _frames_0, _pl_3));
            continue;
          }
        }
      }
    }
  }
}

function $can_push$(_lv_0, _st_0, _t_0, _I_0, _me_0, _start_0, _d_0, _fences_0, _own_0) {
  const _tgt_0 = ($step$(_d_0, _start_0));
  const _x_0 = ($List$length$(($st_ents$(_st_0))));
  const _x_1 = nat_chk(4 * _x_0);
  const _fuel_0 = nat_chk(_x_1 + 8);
  return $pick$(($cell_ok$(_lv_0, _st_0, _t_0, _me_0, _start_0, _tgt_0, _d_0, _fences_0, _own_0)), ($push_loop$(_fuel_0, _lv_0, _st_0, _t_0, _I_0, _d_0, _fences_0, {$: "PStep", "done": false, "ok": true, "stack": {$: "Con", "head": {$: "Frame", "mover": _me_0, "cell": _tgt_0, "rest": ($at$(($st_ents$(_st_0)), _tgt_0))}, "tail": {$: "Nil"}}, "plist": {$: "Nil"}})), {$: "PR", "ok": false, "plist": {$: "Nil"}});
}

function $scan_np$(_os_0, _me_0, _I_0, _ms_0) {
  if (_os_0.$ === "Nil") {
    return true;
  } else {
    const _o_0 = _os_0["head"];
    const _rest_0 = _os_0["tail"];
    const _oid_0 = ($ent_id$(_o_0));
    const _x_0 = ($nat_eq$(_oid_0, _me_0));
    const _x_1 = ($mv_has$(_ms_0, _oid_0));
    const _skip_0 = (_x_0 || _x_1);
    return $pick$(_skip_0, ($scan_np$(_rest_0, _me_0, _I_0, _ms_0)), ($pick$(($is_some_nat$(_I_0, _oid_0)), true, false)));
  }
}

function $can_step$(_lv_0, _st_0, _t_0, _I_0, _me_0, _start_0, _tgt_0, _d_0, _fences_0) {
  return $Bool$and$(($cell_ok$(_lv_0, _st_0, _t_0, _me_0, _start_0, _tgt_0, _d_0, _fences_0, {$: "None"})), ($scan_np$(($at$(($st_ents$(_st_0)), _tgt_0)), _me_0, _I_0, ($txn_moves$(_t_0)))));
}

function $supports_kind$(_k_0) {
  if (_k_0.$ === "Mirror") {
    return false;
  } else {
    return true;
  }
}

function $support_ent$(_es_0, _p_0, _me_0) {
  if (_es_0.$ === "Nil") {
    return false;
  } else {
    const _e_0 = _es_0["head"];
    const _rest_0 = _es_0["tail"];
    const _ok_0 = ($Bool$and$(($Bool$and$(($pos_eq$(($ent_at$(_e_0)), _p_0)), ($Bool$not$(($ent_dead$(_e_0)))))), ($Bool$and$(($supports_kind$(($ent_kind$(_e_0)))), ($Bool$not$(($nat_eq$(($ent_id$(_e_0)), _me_0))))))));
    const _x_0 = ($support_ent$(_rest_0, _p_0, _me_0));
    return (_ok_0 || _x_0);
  }
}

function $supported$(_lv_0, _st_0, _e_0) {
  const _p_0 = ($ent_at$(_e_0));
  const _below_0 = ($step$({$: "DDown"}, _p_0));
  const _es_0 = ($st_ents$(_st_0));
  const _x_0 = ($is_blocker_kind$(($ent_kind$(_e_0))));
  const _x_1 = ($wall$(_lv_0, _p_0));
  const _free_0 = (_x_0 || _x_1);
  const _tree_here_0 = ($any_kind_at$1260$(_es_0, _p_0));
  const _x_2 = ($wall$(_lv_0, _below_0));
  const _x_3 = ($support_ent$(_es_0, _below_0, ($ent_id$(_e_0))));
  const _ground_0 = (_x_2 || _x_3);
  const _bridge_0 = ($closed_gate$(_lv_0, ($st_gates$(_st_0)), {$: "Nil"}, _below_0));
  const _x_4 = (_free_0 || _tree_here_0);
  const _x_5 = (_ground_0 || _bridge_0);
  return (_x_4 || _x_5);
}

function $level_walk_water$(_lv_0) {
  const _ww_0 = _lv_0["walk_water"];
  return _ww_0;
}

function $support_ok$(_lv_0, _st_0, _g_0, _tgt_0) {
  const _dry_0 = ($Bool$not$(($water$(_lv_0, _tgt_0))));
  const _high_0 = ($Bool$and$(($level_walk_water$(_lv_0)), ($nat_lt$(2, ($pos_z$(($ent_at$(_g_0))))))));
  const _x_0 = (_dry_0 || _high_0);
  const _x_1 = ($supported$(_lv_0, _st_0, ($move_ent$(_g_0, _tgt_0))));
  return (_x_0 || _x_1);
}

function $stack_weight$(_fuel_0, _es_0, _p_0, _acc_0) {
  if (_fuel_0 === 0) {
    return _acc_0;
  } else {
    const _f_0 = (_fuel_0 - 1);
    const _up_0 = ($step$({$: "DUp"}, _p_0));
    const _n_0 = ($List$length$(($at$(_es_0, _up_0))));
    return $pick$(($nat_eq$(_n_0, 0)), _acc_0, ($stack_weight$(_f_0, _es_0, _up_0, nat_chk(_acc_0 + _n_0))));
  }
}

function $weight_m$(_m_0, _es_0) {
  if (_m_0.$ === "None") {
    return 1;
  } else {
    const _e_0 = _m_0["value"];
    return $stack_weight$(4, _es_0, ($ent_at$(_e_0)), 1);
  }
}

function $weight_of$(_ids_0, _es_0) {
  if (_ids_0.$ === "Nil") {
    return 0;
  } else {
    const _i_0 = _ids_0["head"];
    const _rest_0 = _ids_0["tail"];
    const _x_0 = ($weight_m$(($find$(_es_0, _i_0)), _es_0));
    const _x_1 = ($weight_of$(_rest_0, _es_0));
    return nat_chk(_x_0 + _x_1);
  }
}

function $is_mirror_mode$(_m_0) {
  if (_m_0.$ === "MMirror") {
    return true;
  } else {
    return false;
  }
}

function $mirror_faces_a$(_f_0) {
  return $flip$(_f_0);
}

function $mirror_faces_b$(_f_0) {
  return $cw$(_f_0);
}

function $bounce$(_f_0, _d_0) {
  return $pick$(($opposite$(($mirror_faces_a$(_f_0)), _d_0)), {$: "Some", "value": ($mirror_faces_b$(_f_0))}, ($pick$(($opposite$(($mirror_faces_b$(_f_0)), _d_0)), {$: "Some", "value": ($mirror_faces_a$(_f_0))}, {$: "None"})));
}

function $mirror_scan$(_m_0, _s_0) {
  if (_m_0.$ === "None") {
    return {$: "Scan", "block": true, "hits": {$: "Nil"}, "newd": {$: "None"}};
  } else {
    const _b_0 = _m_0["value"];
    const _bl_0 = _s_0["block"];
    const _hs_0 = _s_0["hits"];
    return {$: "Scan", "block": _bl_0, "hits": _hs_0, "newd": {$: "Some", "value": _b_0}};
  }
}

function $scan_beam_ent$(_k_0, _o_0, _d_0, _mode_0, _me_0, _s_0) {
  if (_k_0.$ === "Tree") {
    return {$: "Scan", "block": true, "hits": {$: "Nil"}, "newd": {$: "None"}};
  } else if (_k_0.$ === "Sign") {
    return {$: "Scan", "block": true, "hits": {$: "Nil"}, "newd": {$: "None"}};
  } else if (_k_0.$ === "Mirror") {
    const _f_0 = _k_0["facing"];
    return $mirror_scan$(($bounce$(_f_0, _d_0)), _s_0);
  } else if (_k_0.$ === "Rock") {
    const _mr_0 = _k_0["mirrorable"];
    const _b_0 = _s_0["block"];
    const _hs_0 = _s_0["hits"];
    const _nd_0 = _s_0["newd"];
    return $pick$(($Bool$and$(($is_mirror_mode$(_mode_0)), ($Bool$not$(_mr_0)))), {$: "Scan", "block": true, "hits": {$: "Nil"}, "newd": {$: "None"}}, {$: "Scan", "block": _b_0, "hits": ($List$append$(_hs_0, {$: "Con", "head": _o_0, "tail": {$: "Nil"}})), "newd": _nd_0});
  } else {
    const _b_1 = _s_0["block"];
    const _hs_1 = _s_0["hits"];
    const _nd_1 = _s_0["newd"];
    return {$: "Scan", "block": _b_1, "hits": ($List$append$(_hs_1, {$: "Con", "head": _o_0, "tail": {$: "Nil"}})), "newd": _nd_1};
  }
}

function $scan_beam$($0, $1, $2, $3, $4) {
  for (;;) {
    {
      const _os_0 = $0;
      const _d_0 = $1;
      const _mode_0 = $2;
      const _me_0 = $3;
      const _s_0 = $4;
      if (_os_0.$ === "Nil") {
        const _t_0 = _s_0["block"];
        if (_t_0) {
          const _hs_0 = _s_0["hits"];
          const _nd_0 = _s_0["newd"];
          return {$: "Scan", "block": true, "hits": _hs_0, "newd": _nd_0};
        } else {
          const _hs_1 = _s_0["hits"];
          const _nd_1 = _s_0["newd"];
          return {$: "Scan", "block": _t_0, "hits": _hs_1, "newd": _nd_1};
        }
      } else {
        const _o_0 = _os_0["head"];
        const _rest_0 = _os_0["tail"];
        const _t_1 = _s_0["block"];
        if (_t_1) {
          const _hs_2 = _s_0["hits"];
          const _nd_2 = _s_0["newd"];
          return {$: "Scan", "block": true, "hits": _hs_2, "newd": _nd_2};
        } else {
          const _hs_3 = _s_0["hits"];
          const _nd_3 = _s_0["newd"];
          $0 = _rest_0;
          $1 = _d_0;
          $2 = _mode_0;
          $3 = _me_0;
          $4 = ($scan_beam_ent$(($ent_kind$(_o_0)), _o_0, _d_0, _mode_0, _me_0, {$: "Scan", "block": false, "hits": _hs_3, "newd": _nd_3}));
          continue;
        }
      }
    }
  }
}

function $maybe_dir$(_m_0, _d_0) {
  if (_m_0.$ === "None") {
    return _d_0;
  } else {
    const _x_0 = _m_0["value"];
    return _x_0;
  }
}

function $is_some_dir$(_m_0) {
  if (_m_0.$ === "None") {
    return false;
  } else {
    return true;
  }
}

function $reached_max$(_m_0, _s_0) {
  if (_m_0.$ === "None") {
    return false;
  } else {
    const _k_0 = _m_0["value"];
    return $nat_le$(_k_0, _s_0);
  }
}

function $level_fuel$(_lv_0) {
  const _fu_0 = _lv_0["fuel"];
  return _fu_0;
}

function $decide_scan$(_sc_0, _lv_0, _st_0, _start_0, _q_0, _d_0, _s1_0, _bounced_0, _maxs_0, _mode_0) {
  const _t_0 = _sc_0["block"];
  if (_t_0) {
    return {$: "DDone", "tr": {$: "TR", "res": {$: "TBlock"}, "hits": {$: "Nil"}, "cell": _q_0, "steps": _s1_0, "bounced": _bounced_0}};
  } else {
    const _hs_1 = _sc_0["hits"];
    const _nd_1 = _sc_0["newd"];
    const _shut_0 = ($closed_gate$(_lv_0, ($st_gates$(_st_0)), {$: "Nil"}, _q_0));
    const _hit_0 = ($Bool$not$(($list_empty$(_hs_1))));
    const _x_0 = ($is_some_dir$(_nd_1));
    const _b2_0 = (_bounced_0 || _x_0);
    const _d2_0 = ($maybe_dir$(_nd_1, _d_0));
    const _home_0 = ($Bool$and$(($pos_eq$(_q_0, _start_0)), ($Bool$not$(($is_mirror_mode$(_mode_0))))));
    return $pick$(_shut_0, {$: "DDone", "tr": {$: "TR", "res": {$: "TBlock"}, "hits": {$: "Nil"}, "cell": _q_0, "steps": _s1_0, "bounced": _bounced_0}}, ($pick$(_hit_0, {$: "DDone", "tr": {$: "TR", "res": {$: "THit"}, "hits": _hs_1, "cell": _q_0, "steps": _s1_0, "bounced": _bounced_0}}, ($pick$(_home_0, {$: "DDone", "tr": {$: "TR", "res": {$: "TBlock"}, "hits": {$: "Nil"}, "cell": _q_0, "steps": _s1_0, "bounced": _b2_0}}, ($pick$(($reached_max$(_maxs_0, _s1_0)), {$: "DDone", "tr": {$: "TR", "res": {$: "TEnd"}, "hits": {$: "Nil"}, "cell": _q_0, "steps": _s1_0, "bounced": _b2_0}}, {$: "DGo", "p": _q_0, "d": _d2_0, "steps": _s1_0, "bounced": _b2_0})))))));
  }
}

function $decide$(_lv_0, _st_0, _start_0, _p_0, _d_0, _steps_0, _bounced_0, _maxs_0, _mode_0, _me_0) {
  const _q_0 = ($step$(_d_0, _p_0));
  const _s1_0 = nat_chk(_steps_0 + 1);
  return $pick$(($wall$(_lv_0, _q_0)), {$: "DDone", "tr": {$: "TR", "res": {$: "TBlock"}, "hits": {$: "Nil"}, "cell": _q_0, "steps": _s1_0, "bounced": _bounced_0}}, ($decide_scan$(($scan_beam$(($at$(($st_ents$(_st_0)), _q_0)), _d_0, _mode_0, _me_0, {$: "Scan", "block": false, "hits": {$: "Nil"}, "newd": {$: "None"}})), _lv_0, _st_0, _start_0, _q_0, _d_0, _s1_0, _bounced_0, _maxs_0, _mode_0)));
}

function $trace_loop$($0, $1, $2, $3, $4, $5, $6, $7) {
  for (;;) {
    {
      const _fuel_0 = $0;
      const _lv_0 = $1;
      const _st_0 = $2;
      const _start_0 = $3;
      const _maxs_0 = $4;
      const _mode_0 = $5;
      const _me_0 = $6;
      const _dec_0 = $7;
      if (_fuel_0 === 0) {
        if (_dec_0.$ === "DDone") {
          const _tr_0 = _dec_0["tr"];
          return _tr_0;
        } else {
          const _p_0 = _dec_0["p"];
          const _s_0 = _dec_0["steps"];
          const _b_0 = _dec_0["bounced"];
          return {$: "TR", "res": {$: "TEnd"}, "hits": {$: "Nil"}, "cell": _p_0, "steps": _s_0, "bounced": _b_0};
        }
      } else {
        const _f_0 = (_fuel_0 - 1);
        if (_dec_0.$ === "DDone") {
          const _tr_1 = _dec_0["tr"];
          return _tr_1;
        } else {
          const _p_1 = _dec_0["p"];
          const _d_1 = _dec_0["d"];
          const _s_1 = _dec_0["steps"];
          const _b_1 = _dec_0["bounced"];
          $0 = _f_0;
          $1 = _lv_0;
          $2 = _st_0;
          $3 = _start_0;
          $4 = _maxs_0;
          $5 = _mode_0;
          $6 = _me_0;
          $7 = ($decide$(_lv_0, _st_0, _start_0, _p_1, _d_1, _s_1, _b_1, _maxs_0, _mode_0, _me_0));
          continue;
        }
      }
    }
  }
}

function $trace$(_lv_0, _st_0, _start_0, _d_0, _maxs_0, _mode_0, _me_0) {
  return $trace_loop$(($level_fuel$(_lv_0)), _lv_0, _st_0, _start_0, _maxs_0, _mode_0, _me_0, {$: "DGo", "p": _start_0, "d": _d_0, "steps": 0, "bounced": false});
}

function $input_dir$(_i_0) {
  if (_i_0.$ === "U") {
    return {$: "DN"};
  } else if (_i_0.$ === "D") {
    return {$: "DS"};
  } else if (_i_0.$ === "L") {
    return {$: "DW"};
  } else {
    return {$: "DE"};
  }
}

function $frontness$(_d_0, _p_0) {
  if (_d_0.$ === "DE") {
    return $pos_c$(_p_0);
  } else if (_d_0.$ === "DW") {
    const _x_0 = ($pos_c$(_p_0));
    return (200 < _x_0 ? 0 : 200 - _x_0);
  } else if (_d_0.$ === "DS") {
    return $pos_r$(_p_0);
  } else if (_d_0.$ === "DN") {
    const _x_1 = ($pos_r$(_p_0));
    return (200 < _x_1 ? 0 : 200 - _x_1);
  } else {
    return 0;
  }
}

function $insert_front$(_xs_0, _e_0, _d_0) {
  if (_xs_0.$ === "Nil") {
    return {$: "Con", "head": _e_0, "tail": {$: "Nil"}};
  } else {
    const _x_0 = _xs_0["head"];
    const _rest_0 = _xs_0["tail"];
    return $pick$(($nat_lt$(($frontness$(_d_0, ($ent_at$(_x_0)))), ($frontness$(_d_0, ($ent_at$(_e_0)))))), {$: "Con", "head": _e_0, "tail": {$: "Con", "head": _x_0, "tail": _rest_0}}, {$: "Con", "head": _x_0, "tail": ($insert_front$(_rest_0, _e_0, _d_0))});
  }
}

function $sort_front$($0, $1, $2) {
  for (;;) {
    {
      const _xs_0 = $0;
      const _d_0 = $1;
      const _acc_0 = $2;
      if (_xs_0.$ === "Nil") {
        return _acc_0;
      } else {
        const _x_0 = _xs_0["head"];
        const _rest_0 = _xs_0["tail"];
        $0 = _rest_0;
        $1 = _d_0;
        $2 = ($insert_front$(_acc_0, _x_0, _d_0));
        continue;
      }
    }
  }
}

function $group_members$(_es_0, _g_0) {
  if (_es_0.$ === "Nil") {
    return {$: "Nil"};
  } else {
    const _e_0 = _es_0["head"];
    const _rest_0 = _es_0["tail"];
    const _tl_0 = ($group_members$(_rest_0, _g_0));
    return $pick$(($Bool$and$(($Bool$and$(($is_guy$(_e_0)), ($Bool$not$(($ent_dead$(_e_0)))))), ($nat_eq$(($guy_group$(_e_0)), _g_0)))), {$: "Con", "head": _e_0, "tail": _tl_0}, _tl_0);
  }
}

function $role_skill$(_r_0) {
  if (_r_0.$ === "Warrior") {
    return {$: "MultiPush"};
  } else if (_r_0.$ === "Trader") {
    return {$: "SinglePush"};
  } else if (_r_0.$ === "Queen") {
    return {$: "SinglePush"};
  } else {
    return {$: "NoPush"};
  }
}

function $push_allowed$(_s_0, _w_0) {
  if (_s_0.$ === "NoPush") {
    return false;
  } else if (_s_0.$ === "SinglePush") {
    return $nat_le$(_w_0, 1);
  } else {
    return true;
  }
}

function $mv_target_of$(_m_0, _d_0) {
  if (_m_0.$ === "None") {
    return {$: "None"};
  } else {
    const _e_0 = _m_0["value"];
    return {$: "Some", "value": ($step$(_d_0, ($ent_at$(_e_0))))};
  }
}

function $add_moves$($0, $1, $2, $3) {
  for (;;) {
    {
      const _ids_0 = $0;
      const _es_0 = $1;
      const _d_0 = $2;
      const _ms_0 = $3;
      if (_ids_0.$ === "Nil") {
        return _ms_0;
      } else {
        const _i_0 = _ids_0["head"];
        const _rest_0 = _ids_0["tail"];
        const _p_0 = ($Maybe$default$(($mv_target_of$(($find$(_es_0, _i_0)), _d_0)), {$: "Pos", "c": 0, "r": 0, "z": 0}));
        $0 = _rest_0;
        $1 = _es_0;
        $2 = _d_0;
        $3 = ($mv_put$(_ms_0, _i_0, _p_0));
        continue;
      }
    }
  }
}

function $first_movable$(_os_0) {
  if (_os_0.$ === "Nil") {
    return {$: "None"};
  } else {
    const _o_0 = _os_0["head"];
    const _rest_0 = _os_0["tail"];
    return $pick$(($is_movable$(_o_0)), {$: "Some", "value": _o_0}, ($first_movable$(_rest_0)));
  }
}

function $pull_with$(_m_0, _lv_0, _st_0, _g_0, _d_0, _t_0) {
  if (_m_0.$ === "None") {
    return _t_0;
  } else {
    const _b_0 = _m_0["value"];
    const _ms_0 = ($txn_moves$(_t_0));
    const _ok_0 = ($Bool$and$(($Bool$not$(($wall$(_lv_0, ($ent_at$(_b_0)))))), ($Bool$not$(($mv_has$(_ms_0, ($ent_id$(_b_0))))))));
    const _ok2_0 = ($Bool$and$(_ok_0, ($can_step$(_lv_0, _st_0, _t_0, {$: "Some", "value": ($ent_id$(_g_0))}, ($ent_id$(_b_0)), ($ent_at$(_b_0)), ($ent_at$(_g_0)), _d_0, true))));
    return $pick$(_ok2_0, ($txn_with_moves$(_t_0, ($mv_put$(_ms_0, ($ent_id$(_b_0)), ($ent_at$(_g_0)))))), _t_0);
  }
}

function $pull$(_lv_0, _st_0, _g_0, _d_0, _t_0) {
  return $pull_with$(($first_movable$(($at$(($st_ents$(_st_0)), ($step$(($flip$(_d_0)), ($ent_at$(_g_0)))))))), _lv_0, _st_0, _g_0, _d_0, _t_0);
}

function $transmute$(_e_0) {
  const _i_0 = _e_0["id"];
  const _t_0 = _e_0["kind"];
  if (_t_0.$ === "Tree") {
    const _p_0 = _e_0["at"];
    const _t_1 = _e_0["dead"];
    if (_t_1) {
      return {$: "None"};
    } else {
      return {$: "Some", "value": {$: "Ent", "id": _i_0, "kind": {$: "Rock", "mirrorable": true, "stash": {$: "STree"}}, "at": _p_0, "dead": false}};
    }
  } else if (_t_0.$ === "Monster") {
    const _mk_0 = _t_0["mk"];
    const _md_0 = _t_0["dir"];
    const _p_1 = _e_0["at"];
    const _t_2 = _e_0["dead"];
    if (_t_2) {
      return {$: "None"};
    } else {
      return {$: "Some", "value": {$: "Ent", "id": _i_0, "kind": {$: "Rock", "mirrorable": true, "stash": {$: "SMonster", "mk": _mk_0, "dir": _md_0}}, "at": _p_1, "dead": false}};
    }
  } else if (_t_0.$ === "Guy") {
    const _ro_0 = _t_0["role"];
    const _g_0 = _t_0["group"];
    const _o_0 = _t_0["order"];
    const _p_2 = _e_0["at"];
    const _t_3 = _e_0["dead"];
    if (_t_3) {
      return {$: "None"};
    } else {
      return {$: "Some", "value": {$: "Ent", "id": _i_0, "kind": {$: "Rock", "mirrorable": true, "stash": {$: "SGuy", "role": _ro_0, "group": _g_0, "order": _o_0}}, "at": _p_2, "dead": false}};
    }
  } else if (_t_0.$ === "Rock") {
    const _t_4 = _t_0["mirrorable"];
    if (_t_4) {
      const _t_5 = _t_0["stash"];
      if (_t_5.$ === "SNone") {
        const _p_3 = _e_0["at"];
        const _t_6 = _e_0["dead"];
        if (_t_6) {
          return {$: "None"};
        } else {
          return {$: "Some", "value": {$: "Ent", "id": _i_0, "kind": {$: "Tree"}, "at": _p_3, "dead": false}};
        }
      } else if (_t_5.$ === "STree") {
        const _p_4 = _e_0["at"];
        const _t_7 = _e_0["dead"];
        if (_t_7) {
          return {$: "None"};
        } else {
          return {$: "Some", "value": {$: "Ent", "id": _i_0, "kind": {$: "Tree"}, "at": _p_4, "dead": false}};
        }
      } else if (_t_5.$ === "SMonster") {
        const _mk_1 = _t_5["mk"];
        const _md_1 = _t_5["dir"];
        const _p_5 = _e_0["at"];
        const _t_8 = _e_0["dead"];
        if (_t_8) {
          return {$: "None"};
        } else {
          return {$: "Some", "value": {$: "Ent", "id": _i_0, "kind": {$: "Monster", "mk": _mk_1, "dir": _md_1}, "at": _p_5, "dead": false}};
        }
      } else {
        const _ro_1 = _t_5["role"];
        const _g_1 = _t_5["group"];
        const _o_1 = _t_5["order"];
        const _p_6 = _e_0["at"];
        const _t_9 = _e_0["dead"];
        if (_t_9) {
          return {$: "None"};
        } else {
          return {$: "Some", "value": {$: "Ent", "id": _i_0, "kind": {$: "Guy", "role": _ro_1, "group": _g_1, "order": _o_1}, "at": _p_6, "dead": false}};
        }
      }
    } else {
      const _t_10 = _e_0["dead"];
      if (_t_10) {
        return {$: "None"};
      } else {
        return {$: "None"};
      }
    }
  } else {
    const _t_11 = _e_0["dead"];
    if (_t_11) {
      return {$: "None"};
    } else {
      return {$: "None"};
    }
  }
}

function $first_transmute$(_os_0) {
  if (_os_0.$ === "Nil") {
    return {$: "None"};
  } else {
    const _o_0 = _os_0["head"];
    const _rest_0 = _os_0["tail"];
    return $Maybe$or$(($transmute$(_o_0)), ($first_transmute$(_rest_0)));
  }
}

function $any_moving$(_os_0, _ms_0) {
  if (_os_0.$ === "Nil") {
    return false;
  } else {
    const _o_0 = _os_0["head"];
    const _rest_0 = _os_0["tail"];
    const _x_0 = ($mv_has$(_ms_0, ($ent_id$(_o_0))));
    const _x_1 = ($any_moving$(_rest_0, _ms_0));
    return (_x_0 || _x_1);
  }
}

function $txn_add_repl$(_m_0, _t_0) {
  if (_m_0.$ === "None") {
    return _t_0;
  } else {
    const _e_0 = _m_0["value"];
    const _k_0 = _t_0["kind"];
    const _ms_0 = _t_0["moves"];
    const _ks_0 = _t_0["kills"];
    const _mg_0 = _t_0["merges"];
    const _rp_0 = _t_0["repl"];
    const _nw_0 = _t_0["news"];
    const _gs_0 = _t_0["gates"];
    return {$: "Txn", "kind": _k_0, "moves": _ms_0, "kills": _ks_0, "merges": _mg_0, "repl": ($List$append$(_rp_0, {$: "Con", "head": _e_0, "tail": {$: "Nil"}})), "news": _nw_0, "gates": _gs_0};
  }
}

function $druid_bump$(_lv_0, _st_0, _g_0, _d_0, _t_0) {
  const _p_0 = ($step$(_d_0, ($ent_at$(_g_0))));
  const _os_0 = ($at$(($st_ents$(_st_0)), _p_0));
  const _x_0 = ($wall$(_lv_0, _p_0));
  const _x_1 = ($fence_blocks$(_lv_0, ($ent_at$(_g_0)), _d_0));
  const _x_2 = (_x_0 || _x_1);
  const _x_3 = ($any_moving$(_os_0, ($txn_moves$(_t_0))));
  const _stop_0 = (_x_2 || _x_3);
  const _t2_0 = _t_0;
  return $pick$(_stop_0, _t2_0, ($txn_add_repl$(($first_transmute$(_os_0)), _t2_0)));
}

function $walk_pushed$(_pr_0, _lv_0, _st_0, _g_0, _d_0, _t_0) {
  const _ok_0 = _pr_0["ok"];
  const _pl_0 = _pr_0["plist"];
  const _role_0 = ($guy_role$(_g_0));
  const _tgt_0 = ($step$(_d_0, ($ent_at$(_g_0))));
  const _es_0 = ($st_ents$(_st_0));
  const _ok1_0 = ($Bool$and$(_ok_0, ($support_ok$(_lv_0, _st_0, _g_0, _tgt_0))));
  const _x_0 = ($list_empty$(_pl_0));
  const _x_1 = ($push_allowed$(($role_skill$(_role_0)), ($weight_of$(_pl_0, _es_0))));
  const _ok2_0 = ($Bool$and$(_ok1_0, (_x_0 || _x_1)));
  const _moved_0 = ($txn_with_moves$(_t_0, ($add_moves$(_pl_0, _es_0, _d_0, ($mv_put$(($txn_moves$(_t_0)), ($ent_id$(_g_0)), _tgt_0))))));
  const _pulled_0 = ($pick$(($role_is$(_role_0, {$: "Thief"})), ($pull$(_lv_0, _st_0, _g_0, _d_0, ($txn_with_moves$(_t_0, ($mv_put$(($txn_moves$(_t_0)), ($ent_id$(_g_0)), _tgt_0)))))), _moved_0));
  const _withpull_0 = ($pick$(($role_is$(_role_0, {$: "Thief"})), ($txn_with_moves$(_pulled_0, ($add_moves$(_pl_0, _es_0, _d_0, ($txn_moves$(_pulled_0)))))), _moved_0));
  return $pick$(_ok2_0, _withpull_0, ($pick$(($role_is$(_role_0, {$: "Druid"})), ($druid_bump$(_lv_0, _st_0, _g_0, _d_0, _t_0)), _t_0)));
}

function $walk$(_lv_0, _st_0, _g_0, _d_0, _t_0) {
  return $walk_pushed$(($can_push$(_lv_0, _st_0, _t_0, {$: "Some", "value": ($ent_id$(_g_0))}, ($ent_id$(_g_0)), ($ent_at$(_g_0)), _d_0, true, {$: "None"})), _lv_0, _st_0, _g_0, _d_0, _t_0);
}

function $drop_id$(_es_0, _i_0) {
  if (_es_0.$ === "Nil") {
    return {$: "Nil"};
  } else {
    const _e_0 = _es_0["head"];
    const _rest_0 = _es_0["tail"];
    const _tl_0 = ($drop_id$(_rest_0, _i_0));
    return $pick$(($nat_eq$(($ent_id$(_e_0)), _i_0)), _tl_0, {$: "Con", "head": _e_0, "tail": _tl_0});
  }
}

function $swap_moves$($0, $1, $2) {
  for (;;) {
    {
      const _hs_0 = $0;
      const _home_0 = $1;
      const _ms_0 = $2;
      if (_hs_0.$ === "Nil") {
        return _ms_0;
      } else {
        const _h_0 = _hs_0["head"];
        const _rest_0 = _hs_0["tail"];
        $0 = _rest_0;
        $1 = _home_0;
        $2 = ($mv_put$(_ms_0, ($ent_id$(_h_0)), _home_0));
        continue;
      }
    }
  }
}

function $wizard_swap$(_tr_0, _lv_0, _g_0, _t_0) {
  const _t_1 = _tr_0["res"];
  if (_t_1.$ === "THit") {
    const _hits_0 = _tr_0["hits"];
    const _cell_0 = _tr_0["cell"];
    const _hs_0 = ($drop_id$(_hits_0, ($ent_id$(_g_0))));
    const _ok_0 = ($Bool$and$(($Bool$not$(($list_empty$(_hs_0)))), ($Bool$not$(($wall$(_lv_0, ($ent_at$(_g_0))))))));
    const _moved_0 = ($txn_with_moves$(_t_0, ($swap_moves$(_hs_0, ($ent_at$(_g_0)), ($mv_put$(($txn_moves$(_t_0)), ($ent_id$(_g_0)), _cell_0))))));
    return $pick$(_ok_0, {$: "Some", "value": _moved_0}, {$: "None"});
  } else {
    return {$: "None"};
  }
}

function $charm_back$(_d_0, _b_0, _e_0) {
  if (_d_0.$ === "DE") {
    const _x_0 = ($pos_c$(_b_0));
    const _x_1 = nat_chk(2 + _x_0);
    const _x_2 = ($pos_c$(_e_0));
    return (_x_1 < _x_2 ? 0 : _x_1 - _x_2);
  } else if (_d_0.$ === "DW") {
    const _x_3 = ($pos_c$(_e_0));
    const _x_4 = nat_chk(2 + _x_3);
    const _x_5 = ($pos_c$(_b_0));
    return (_x_4 < _x_5 ? 0 : _x_4 - _x_5);
  } else if (_d_0.$ === "DS") {
    const _x_6 = ($pos_r$(_b_0));
    const _x_7 = nat_chk(2 + _x_6);
    const _x_8 = ($pos_r$(_e_0));
    return (_x_7 < _x_8 ? 0 : _x_7 - _x_8);
  } else if (_d_0.$ === "DN") {
    const _x_9 = ($pos_r$(_e_0));
    const _x_10 = nat_chk(2 + _x_9);
    const _x_11 = ($pos_r$(_b_0));
    return (_x_10 < _x_11 ? 0 : _x_10 - _x_11);
  } else {
    return 2;
  }
}

function $charm_key$(_d_0, _b_0, _e_0) {
  const _x_0 = ($pos_z$(_e_0));
  const _x_1 = nat_chk(_x_0 + 2);
  const _x_2 = ($pos_z$(_b_0));
  const _dz_0 = (_x_1 < _x_2 ? 0 : _x_1 - _x_2);
  const _back_0 = ($charm_back$(_d_0, _b_0, _e_0));
  const _x_3 = nat_chk(_dz_0 * 5);
  return nat_chk(_x_3 + _back_0);
}

function $charm_rock$(_k_0) {
  if (_k_0.$ === "Rock") {
    const _m_0 = _k_0["mirrorable"];
    return _m_0;
  } else {
    return false;
  }
}

function $charmable$(_lv_0, _b_0, _e_0) {
  const _k_0 = ($ent_kind$(_e_0));
  const _x_0 = ($is_monster_kind$(_k_0));
  const _x_1 = ($charm_rock$(_k_0));
  const _x_2 = ($Bool$and$(($is_guy_kind$(_k_0)), ($Bool$not$(($nat_eq$(($guy_group$(_e_0)), ($guy_group$(_b_0))))))));
  const _x_3 = (_x_0 || _x_1);
  const _kind_ok_0 = (_x_2 || _x_3);
  const _base_0 = ($Bool$and$(($Bool$and$(($Bool$not$(($ent_dead$(_e_0)))), ($Bool$not$(($nat_eq$(($ent_id$(_e_0)), ($ent_id$(_b_0)))))))), ($chebyshev_le2$(($ent_at$(_e_0)), ($ent_at$(_b_0))))));
  return $Bool$and$(($Bool$and$(_base_0, _kind_ok_0)), ($Bool$not$(($wall$(_lv_0, ($ent_at$(_e_0)))))));
}

function $charm_set$(_es_0, _lv_0, _b_0) {
  if (_es_0.$ === "Nil") {
    return {$: "Nil"};
  } else {
    const _e_0 = _es_0["head"];
    const _rest_0 = _es_0["tail"];
    const _tl_0 = ($charm_set$(_rest_0, _lv_0, _b_0));
    return $pick$(($charmable$(_lv_0, _b_0, _e_0)), {$: "Con", "head": _e_0, "tail": _tl_0}, _tl_0);
  }
}

function $insert_charm$(_xs_0, _e_0, _d_0, _b_0) {
  if (_xs_0.$ === "Nil") {
    return {$: "Con", "head": _e_0, "tail": {$: "Nil"}};
  } else {
    const _x_0 = _xs_0["head"];
    const _rest_0 = _xs_0["tail"];
    return $pick$(($nat_lt$(($charm_key$(_d_0, _b_0, ($ent_at$(_e_0)))), ($charm_key$(_d_0, _b_0, ($ent_at$(_x_0)))))), {$: "Con", "head": _e_0, "tail": {$: "Con", "head": _x_0, "tail": _rest_0}}, {$: "Con", "head": _x_0, "tail": ($insert_charm$(_rest_0, _e_0, _d_0, _b_0))});
  }
}

function $sort_charm$($0, $1, $2, $3) {
  for (;;) {
    {
      const _xs_0 = $0;
      const _d_0 = $1;
      const _b_0 = $2;
      const _acc_0 = $3;
      if (_xs_0.$ === "Nil") {
        return _acc_0;
      } else {
        const _x_0 = _xs_0["head"];
        const _rest_0 = _xs_0["tail"];
        $0 = _rest_0;
        $1 = _d_0;
        $2 = _b_0;
        $3 = ($insert_charm$(_acc_0, _x_0, _d_0, _b_0));
        continue;
      }
    }
  }
}

function $charm_moves$($0, $1, $2, $3, $4, $5) {
  for (;;) {
    {
      const _xs_0 = $0;
      const _lv_0 = $1;
      const _st_0 = $2;
      const _b_0 = $3;
      const _d_0 = $4;
      const _t_0 = $5;
      if (_xs_0.$ === "Nil") {
        return _t_0;
      } else {
        const _e_0 = _xs_0["head"];
        const _rest_0 = _xs_0["tail"];
        const _tgt_0 = ($step$(_d_0, ($ent_at$(_e_0))));
        const _x_0 = ($Bool$not$(($nat_eq$(($ent_id$(_e_0)), ($ent_id$(_b_0))))));
        const _x_1 = ($support_ok$(_lv_0, _st_0, _b_0, _tgt_0));
        const _ok_0 = ($Bool$and$(($can_step$(_lv_0, _st_0, _t_0, {$: "Some", "value": ($ent_id$(_e_0))}, ($ent_id$(_e_0)), ($ent_at$(_e_0)), _tgt_0, _d_0, true)), (_x_0 || _x_1)));
        $0 = _rest_0;
        $1 = _lv_0;
        $2 = _st_0;
        $3 = _b_0;
        $4 = _d_0;
        $5 = ($pick$(_ok_0, ($txn_with_moves$(_t_0, ($mv_put$(($txn_moves$(_t_0)), ($ent_id$(_e_0)), _tgt_0)))), _t_0));
        continue;
      }
    }
  }
}

function $insert_charm_last$(_xs_0, _b_0, _d_0, _bp_0) {
  return $insert_charm$(_xs_0, _b_0, _d_0, _bp_0);
}

function $bard_step$(_lv_0, _st_0, _b_0, _d_0, _t_0) {
  const _cs_0 = ($charm_set$(($st_ents$(_st_0)), _lv_0, _b_0));
  const _order_0 = ($List$append$(($sort_charm$(_cs_0, _d_0, ($ent_at$(_b_0)), {$: "Nil"})), {$: "Nil"}));
  const _full_0 = ($insert_charm_last$(_order_0, _b_0, _d_0, ($ent_at$(_b_0))));
  const _t2_0 = ($charm_moves$(_full_0, _lv_0, _st_0, _b_0, _d_0, _t_0));
  const _bard_moved_0 = ($mv_has$(($txn_moves$(_t2_0)), ($ent_id$(_b_0))));
  return $pick$(($list_empty$(_cs_0)), {$: "None"}, {$: "Some", "value": ($pick$(_bard_moved_0, _t2_0, _t_0))});
}

function $enact_role$(_r_0, _lv_0, _st_0, _g_0, _d_0, _t_0) {
  if (_r_0.$ === "Wizard") {
    const _sw_0 = ($wizard_swap$(($trace$(_lv_0, _st_0, ($ent_at$(_g_0)), _d_0, {$: "None"}, {$: "MWizard"}, {$: "Some", "value": ($ent_id$(_g_0))})), _lv_0, _g_0, _t_0));
    return $Maybe$default$(_sw_0, ($walk$(_lv_0, _st_0, _g_0, _d_0, _t_0)));
  } else if (_r_0.$ === "Bard") {
    return $Maybe$default$(($bard_step$(_lv_0, _st_0, _g_0, _d_0, _t_0)), ($walk$(_lv_0, _st_0, _g_0, _d_0, _t_0)));
  } else {
    return $walk$(_lv_0, _st_0, _g_0, _d_0, _t_0);
  }
}

function $enact_all$($0, $1, $2, $3, $4) {
  for (;;) {
    {
      const _gs_0 = $0;
      const _lv_0 = $1;
      const _st_0 = $2;
      const _d_0 = $3;
      const _t_0 = $4;
      if (_gs_0.$ === "Nil") {
        return _t_0;
      } else {
        const _g_0 = _gs_0["head"];
        const _rest_0 = _gs_0["tail"];
        $0 = _rest_0;
        $1 = _lv_0;
        $2 = _st_0;
        $3 = _d_0;
        $4 = ($enact_role$(($guy_role$(_g_0)), _lv_0, _st_0, _g_0, _d_0, _t_0));
        continue;
      }
    }
  }
}

function $enact$(_lv_0, _st_0, _d_0) {
  return $enact_all$(($sort_front$(($group_members$(($st_ents$(_st_0)), ($st_sel$(_st_0)))), _d_0, {$: "Nil"})), _lv_0, _st_0, _d_0, ($empty_txn$({$: "TPlayer"})));
}

function $seen_of$(_tr_0, _side_0) {
  const _t_0 = _tr_0["res"];
  if (_t_0.$ === "THit") {
    const _t_1 = _tr_0["hits"];
    if (_t_1.$ === "Con") {
      const _h_0 = _t_1["head"];
      const _s_0 = _tr_0["steps"];
      const _t_2 = _tr_0["bounced"];
      if (!_t_2) {
        return {$: "Some", "value": {$: "Seen", "e": _h_0, "dist": _s_0, "side": _side_0}};
      } else {
        return {$: "None"};
      }
    } else {
      return {$: "None"};
    }
  } else {
    return {$: "None"};
  }
}

function $choose$(_a_0, _b_0) {
  if (_a_0.$ === "None") {
    return {$: "Pick", "seen": _b_0, "conflict": false};
  } else {
    const _t_0 = _a_0["value"];
    const _ea_0 = _t_0["e"];
    const _da_0 = _t_0["dist"];
    const _sa_0 = _t_0["side"];
    if (_b_0.$ === "None") {
      return {$: "Pick", "seen": {$: "Some", "value": {$: "Seen", "e": _ea_0, "dist": _da_0, "side": _sa_0}}, "conflict": false};
    } else {
      const _t_1 = _b_0["value"];
      const _eb_0 = _t_1["e"];
      const _db_0 = _t_1["dist"];
      const _sb_0 = _t_1["side"];
      return $pick$(($nat_lt$(_da_0, _db_0)), {$: "Pick", "seen": {$: "Some", "value": {$: "Seen", "e": _ea_0, "dist": _da_0, "side": _sa_0}}, "conflict": false}, ($pick$(($nat_lt$(_db_0, _da_0)), {$: "Pick", "seen": {$: "Some", "value": {$: "Seen", "e": _eb_0, "dist": _db_0, "side": _sb_0}}, "conflict": false}, ($pick$(($nat_eq$(($ent_id$(_ea_0)), ($ent_id$(_eb_0)))), {$: "Pick", "seen": {$: "Some", "value": {$: "Seen", "e": _eb_0, "dist": _db_0, "side": _sb_0}}, "conflict": false}, {$: "Pick", "seen": {$: "Some", "value": {$: "Seen", "e": _ea_0, "dist": _da_0, "side": _sa_0}}, "conflict": true})))));
    }
  }
}

function $is_end$(_r_0) {
  if (_r_0.$ === "TEnd") {
    return true;
  } else {
    return false;
  }
}

function $mirage_from$(_tr_0, _e_0, _k_0, _cf_0, _lv_0, _st_0) {
  const _res_0 = _tr_0["res"];
  const _tgt_0 = _tr_0["cell"];
  const _steps_0 = _tr_0["steps"];
  const _ok_0 = ($Bool$and$(($Bool$and$(($Bool$not$(_cf_0)), ($is_end$(_res_0)))), ($nat_eq$(_steps_0, nat_chk(_k_0 + _k_0)))));
  const _ok2_0 = ($Bool$and$(_ok_0, ($Bool$and$(($Bool$not$(($wall$(_lv_0, _tgt_0)))), ($can_step$(_lv_0, _st_0, ($empty_txn$({$: "TPlayer"})), {$: "None"}, ($ent_id$(_e_0)), ($ent_at$(_e_0)), _tgt_0, {$: "DN"}, false))))));
  return {$: "Some", "value": {$: "Mirage", "e": _e_0, "tgt": _tgt_0, "valid": _ok2_0}};
}

function $mirage_of$(_p_0, _lv_0, _st_0) {
  const _t_0 = _p_0["seen"];
  if (_t_0.$ === "None") {
    return {$: "None"};
  } else {
    const _t_1 = _t_0["value"];
    const _e_0 = _t_1["e"];
    const _k_0 = _t_1["dist"];
    const _side_0 = _t_1["side"];
    const _cf_1 = _p_0["conflict"];
    return $mirage_from$(($trace$(_lv_0, _st_0, ($ent_at$(_e_0)), ($flip$(_side_0)), {$: "Some", "value": nat_chk(_k_0 + _k_0)}, {$: "MMirror"}, {$: "None"})), _e_0, _k_0, _cf_1, _lv_0, _st_0);
  }
}

function $mirror_mirage$(_m_0, _lv_0, _st_0) {
  const _t_0 = _m_0["kind"];
  if (_t_0.$ === "Mirror") {
    const _f_0 = _t_0["facing"];
    const _t_1 = _t_0["magic"];
    if (_t_1) {
      const _p_0 = _m_0["at"];
      const _t_2 = _m_0["dead"];
      if (!_t_2) {
        const _a_0 = ($trace$(_lv_0, _st_0, _p_0, ($flip$(_f_0)), {$: "None"}, {$: "MMirror"}, {$: "None"}));
        const _b_0 = ($trace$(_lv_0, _st_0, _p_0, ($cw$(_f_0)), {$: "None"}, {$: "MMirror"}, {$: "None"}));
        return $pick$(($wall$(_lv_0, _p_0)), {$: "None"}, ($mirage_of$(($choose$(($seen_of$(_a_0, ($flip$(_f_0)))), ($seen_of$(_b_0, ($cw$(_f_0)))))), _lv_0, _st_0)));
      } else {
        return {$: "None"};
      }
    } else {
      return {$: "None"};
    }
  } else {
    return {$: "None"};
  }
}

function $mirage_cons$(_m_0, _tl_0) {
  if (_m_0.$ === "None") {
    return _tl_0;
  } else {
    const _x_0 = _m_0["value"];
    return {$: "Con", "head": _x_0, "tail": _tl_0};
  }
}

function $mirages$(_es_0, _lv_0, _st_0) {
  if (_es_0.$ === "Nil") {
    return {$: "Nil"};
  } else {
    const _e_0 = _es_0["head"];
    const _rest_0 = _es_0["tail"];
    const _tl_0 = ($mirages$(_rest_0, _lv_0, _st_0));
    const _m_0 = ($mirror_mirage$(_e_0, _lv_0, _st_0));
    return $mirage_cons$(_m_0, _tl_0);
  }
}

function $clones_match$(_a_0, _b_0) {
  const _ia_0 = _a_0["id"];
  const _t_0 = _a_0["kind"];
  if (_t_0.$ === "Rock") {
    const _ma_0 = _t_0["mirrorable"];
    const _ib_0 = _b_0["id"];
    const _t_1 = _b_0["kind"];
    if (_t_1.$ === "Rock") {
      const _mb_0 = _t_1["mirrorable"];
      const _x_0 = ($nat_eq$(_ia_0, _ib_0));
      const _x_1 = ($bool_eq$(_ma_0, _mb_0));
      return (_x_0 || _x_1);
    } else {
      return $nat_eq$(_ia_0, _ib_0);
    }
  } else if (_t_0.$ === "Guy") {
    const _ra_0 = _t_0["role"];
    const _ga_0 = _t_0["group"];
    const _ib_1 = _b_0["id"];
    const _t_2 = _b_0["kind"];
    if (_t_2.$ === "Guy") {
      const _rb_0 = _t_2["role"];
      const _gb_0 = _t_2["group"];
      const _x_2 = ($nat_eq$(_ia_0, _ib_1));
      const _x_3 = ($Bool$and$(($role_is$(_ra_0, _rb_0)), ($nat_eq$(_ga_0, _gb_0))));
      return (_x_2 || _x_3);
    } else {
      return $nat_eq$(_ia_0, _ib_1);
    }
  } else {
    const _ib_2 = _b_0["id"];
    return $nat_eq$(_ia_0, _ib_2);
  }
}

function $all_valid$(_ms_0) {
  if (_ms_0.$ === "Nil") {
    return true;
  } else {
    const _t_0 = _ms_0["head"];
    const _v_0 = _t_0["valid"];
    const _rest_0 = _ms_0["tail"];
    return $Bool$and$(_v_0, ($all_valid$(_rest_0)));
  }
}

function $clash_with$(_ms_0, _e_0, _t_0) {
  if (_ms_0.$ === "Nil") {
    return false;
  } else {
    const _t_1 = _ms_0["head"];
    const _e2_0 = _t_1["e"];
    const _t2_0 = _t_1["tgt"];
    const _rest_0 = _ms_0["tail"];
    const _x_0 = ($Bool$and$(($pos_eq$(_t_0, _t2_0)), ($Bool$not$(($clones_match$(_e_0, _e2_0))))));
    const _x_1 = ($clash_with$(_rest_0, _e_0, _t_0));
    return (_x_0 || _x_1);
  }
}

function $any_clash$(_ms_0) {
  if (_ms_0.$ === "Nil") {
    return false;
  } else {
    const _t_0 = _ms_0["head"];
    const _e_0 = _t_0["e"];
    const _t_1 = _t_0["tgt"];
    const _rest_0 = _ms_0["tail"];
    const _x_0 = ($clash_with$(_rest_0, _e_0, _t_1));
    const _x_1 = ($any_clash$(_rest_0));
    return (_x_0 || _x_1);
  }
}

function $placed_at$(_ps_0, _p_0) {
  if (_ps_0.$ === "Nil") {
    return {$: "None"};
  } else {
    const _t_0 = _ps_0["head"];
    const _q_0 = _t_0["at"];
    const _e_0 = _t_0["e"];
    const _rest_0 = _ps_0["tail"];
    return $pick$(($pos_eq$(_q_0, _p_0)), {$: "Some", "value": _e_0}, ($placed_at$(_rest_0, _p_0)));
  }
}

function $merge_test$(_m_0, _e_0) {
  if (_m_0.$ === "None") {
    return {$: "None"};
  } else {
    const _x_0 = _m_0["value"];
    return {$: "Some", "value": ($clones_match$(_x_0, _e_0))};
  }
}

function $same_id$(_m_0, _e_0) {
  if (_m_0.$ === "None") {
    return {$: "None"};
  } else {
    const _x_0 = _m_0["value"];
    return {$: "Some", "value": ($nat_eq$(($ent_id$(_x_0)), ($ent_id$(_e_0))))};
  }
}

function $set_id$(_e_0, _i_0) {
  const _k_0 = _e_0["kind"];
  const _p_0 = _e_0["at"];
  const _d_0 = _e_0["dead"];
  return {$: "Ent", "id": _i_0, "kind": _k_0, "at": _p_0, "dead": _d_0};
}

function $apply_mirage$(_m_0, _a_0) {
  const _e_0 = _m_0["e"];
  const _tgt_0 = _m_0["tgt"];
  const _t_0 = _a_0["t"];
  const _k_0 = _t_0["kind"];
  const _ms_0 = _t_0["moves"];
  const _ks_0 = _t_0["kills"];
  const _mg_0 = _t_0["merges"];
  const _rp_0 = _t_0["repl"];
  const _nw_0 = _t_0["news"];
  const _gs_0 = _t_0["gates"];
  const _ps_0 = _a_0["placed"];
  const _nid_0 = _a_0["nid"];
  const _prev_0 = ($placed_at$(_ps_0, _tgt_0));
  const _merge_0 = ($Maybe$default$(($merge_test$(_prev_0, _e_0)), false));
  const _moved_0 = ($mv_has$(_ms_0, ($ent_id$(_e_0))));
  const _drop_0 = ($Bool$and$(_merge_0, ($Bool$and$(($Bool$not$(_moved_0)), ($Bool$not$(($Maybe$default$(($same_id$(_prev_0, _e_0)), true))))))));
  const _clone_0 = ($move_ent$(($set_id$(_e_0, _nid_0)), _tgt_0));
  return $pick$(_merge_0, {$: "AState", "t": {$: "Txn", "kind": _k_0, "moves": _ms_0, "kills": _ks_0, "merges": ($pick$(_drop_0, ($List$append$(_mg_0, {$: "Con", "head": ($ent_id$(_e_0)), "tail": {$: "Nil"}})), _mg_0)), "repl": _rp_0, "news": _nw_0, "gates": _gs_0}, "placed": _ps_0, "nid": _nid_0}, ($pick$(_moved_0, {$: "AState", "t": {$: "Txn", "kind": _k_0, "moves": _ms_0, "kills": _ks_0, "merges": _mg_0, "repl": _rp_0, "news": ($List$append$(_nw_0, {$: "Con", "head": _clone_0, "tail": {$: "Nil"}})), "gates": _gs_0}, "placed": {$: "Con", "head": {$: "Placed", "at": _tgt_0, "e": _clone_0}, "tail": _ps_0}, "nid": nat_chk(_nid_0 + 1)}, {$: "AState", "t": {$: "Txn", "kind": _k_0, "moves": ($mv_put$(_ms_0, ($ent_id$(_e_0)), _tgt_0)), "kills": _ks_0, "merges": _mg_0, "repl": _rp_0, "news": _nw_0, "gates": _gs_0}, "placed": {$: "Con", "head": {$: "Placed", "at": _tgt_0, "e": _e_0}, "tail": _ps_0}, "nid": _nid_0})));
}

function $apply_mirages$($0, $1) {
  for (;;) {
    {
      const _ms_0 = $0;
      const _a_0 = $1;
      if (_ms_0.$ === "Nil") {
        return _a_0;
      } else {
        const _m_0 = _ms_0["head"];
        const _rest_0 = _ms_0["tail"];
        $0 = _rest_0;
        $1 = ($apply_mirage$(_m_0, _a_0));
        continue;
      }
    }
  }
}

function $astate_txn$(_a_0) {
  const _t_0 = _a_0["t"];
  return _t_0;
}

function $activate$(_lv_0, _st_0) {
  const _ms_0 = ($mirages$(($st_ents$(_st_0)), _lv_0, _st_0));
  const _ok_0 = ($Bool$and$(($Bool$and$(($Bool$not$(($list_empty$(_ms_0)))), ($all_valid$(_ms_0)))), ($Bool$not$(($any_clash$(_ms_0))))));
  const _nid_0 = nat_chk(($max_id$(($st_ents$(_st_0)), 0)) + 1);
  return $pick$(_ok_0, ($astate_txn$(($apply_mirages$(_ms_0, {$: "AState", "t": ($empty_txn$({$: "TPlayer"})), "placed": {$: "Nil"}, "nid": _nid_0})))), ($empty_txn$({$: "TPlayer"})));
}

function $set_gate$(_gs_0, _n_0, _v_0) {
  return $List$set$(_gs_0, _n_0, _v_0);
}

function $gate_info$(_gs_0, _n_0) {
  return $List$get$(_gs_0, _n_0);
}

function $level_gates$(_lv_0) {
  const _gs_0 = _lv_0["gates"];
  return _gs_0;
}

function $shift_one$(_m_0, _d_0, _es_0) {
  if (_m_0.$ === "None") {
    return _es_0;
  } else {
    const _e_0 = _m_0["value"];
    return $set_ent$(_es_0, ($move_ent$(_e_0, ($step$(_d_0, ($ent_at$(_e_0)))))));
  }
}

function $shift_all$($0, $1, $2) {
  for (;;) {
    {
      const _ids_0 = $0;
      const _d_0 = $1;
      const _es_0 = $2;
      if (_ids_0.$ === "Nil") {
        return _es_0;
      } else {
        const _i_0 = _ids_0["head"];
        const _rest_0 = _ids_0["tail"];
        $0 = _rest_0;
        $1 = _d_0;
        $2 = ($shift_one$(($find$(_es_0, _i_0)), _d_0, _es_0));
        continue;
      }
    }
  }
}

function $destroy$(_m_0, _es_0) {
  if (_m_0.$ === "None") {
    return _es_0;
  } else {
    const _e_0 = _m_0["value"];
    const _x_0 = ($is_guy$(_e_0));
    const _x_1 = ($is_monster_kind$(($ent_kind$(_e_0))));
    return $pick$((_x_0 || _x_1), ($set_ent$(_es_0, ($kill_ent$(_e_0)))), ($remove_ent$(_es_0, ($ent_id$(_e_0)))));
  }
}

function $close_result$(_pr_0, _d_0, _st_0) {
  const _ok_0 = _pr_0["ok"];
  const _t_0 = _pr_0["plist"];
  if (_t_0.$ === "Nil") {
    return _st_0;
  } else {
    const _i_0 = _t_0["head"];
    const _rest_0 = _t_0["tail"];
    const _es_0 = _st_0["ents"];
    const _gs_0 = _st_0["gates"];
    const _sel_0 = _st_0["sel"];
    return $pick$(_ok_0, {$: "State", "ents": ($shift_all$({$: "Con", "head": _i_0, "tail": _rest_0}, _d_0, _es_0)), "gates": _gs_0, "sel": _sel_0}, {$: "State", "ents": ($destroy$(($find$(_es_0, _i_0)), _es_0)), "gates": _gs_0, "sel": _sel_0});
  }
}

function $close_gate$(_m_0, _lv_0, _st_0) {
  if (_m_0.$ === "None") {
    return _st_0;
  } else {
    const _t_0 = _m_0["value"];
    const _gp_0 = _t_0["at"];
    const _d_0 = _t_0["close"];
    const _start_0 = ($step$(($flip$(_d_0)), _gp_0));
    const _fake_0 = nat_chk(($max_id$(($st_ents$(_st_0)), 0)) + 1);
    const _occupied_0 = ($Bool$not$(($list_empty$(($at$(($st_ents$(_st_0)), _gp_0))))));
    return $pick$(_occupied_0, ($close_result$(($can_push$(_lv_0, _st_0, ($empty_txn$({$: "TGate"})), {$: "None"}, _fake_0, _start_0, _d_0, false, {$: "Some", "value": _gp_0})), _d_0, _st_0)), _st_0);
  }
}

function $commit_gates$($0, $1, $2) {
  for (;;) {
    {
      const _xs_0 = $0;
      const _lv_0 = $1;
      const _c_0 = $2;
      if (_xs_0.$ === "Nil") {
        return _c_0;
      } else {
        const _t_0 = _xs_0["head"];
        const _i_0 = _t_0["ix"];
        const _want_0 = _t_0["open"];
        const _rest_0 = _xs_0["tail"];
        const _t_1 = _c_0["st"];
        const _es_0 = _t_1["ents"];
        const _gs_0 = _t_1["gates"];
        const _sel_0 = _t_1["sel"];
        const _ch_0 = _c_0["changed"];
        const _cur_0 = ($gate_open_at$(_gs_0, _i_0));
        const _s1_0 = {$: "State", "ents": _es_0, "gates": ($set_gate$(_gs_0, _i_0, _want_0)), "sel": _sel_0};
        const _s2_0 = ($pick$(_want_0, _s1_0, ($close_gate$(($gate_info$(($level_gates$(_lv_0)), _i_0)), _lv_0, _s1_0))));
        $0 = _rest_0;
        $1 = _lv_0;
        $2 = ($pick$(($bool_eq$(_cur_0, _want_0)), {$: "CS", "st": {$: "State", "ents": _es_0, "gates": _gs_0, "sel": _sel_0}, "changed": _ch_0}, {$: "CS", "st": _s2_0, "changed": true}));
        continue;
      }
    }
  }
}

function $commit_move$(_m_0, _p_0, _es_0, _gs_0, _sel_0, _ch_0) {
  if (_m_0.$ === "None") {
    return {$: "CS", "st": {$: "State", "ents": _es_0, "gates": _gs_0, "sel": _sel_0}, "changed": _ch_0};
  } else {
    const _e_0 = _m_0["value"];
    const _same_0 = ($pos_eq$(($ent_at$(_e_0)), _p_0));
    return $pick$(_same_0, {$: "CS", "st": {$: "State", "ents": _es_0, "gates": _gs_0, "sel": _sel_0}, "changed": _ch_0}, {$: "CS", "st": {$: "State", "ents": ($set_ent$(_es_0, ($move_ent$(_e_0, _p_0)))), "gates": _gs_0, "sel": _sel_0}, "changed": true});
  }
}

function $commit_moves$($0, $1) {
  for (;;) {
    {
      const _xs_0 = $0;
      const _c_0 = $1;
      if (_xs_0.$ === "Nil") {
        return _c_0;
      } else {
        const _t_0 = _xs_0["head"];
        const _i_0 = _t_0["id"];
        const _p_0 = _t_0["to"];
        const _rest_0 = _xs_0["tail"];
        const _t_1 = _c_0["st"];
        const _es_0 = _t_1["ents"];
        const _gs_0 = _t_1["gates"];
        const _sel_0 = _t_1["sel"];
        const _ch_0 = _c_0["changed"];
        $0 = _rest_0;
        $1 = ($commit_move$(($find$(_es_0, _i_0)), _p_0, _es_0, _gs_0, _sel_0, _ch_0));
        continue;
      }
    }
  }
}

function $commit_kill$(_m_0, _es_0, _gs_0, _sel_0, _ch_0) {
  if (_m_0.$ === "None") {
    return {$: "CS", "st": {$: "State", "ents": _es_0, "gates": _gs_0, "sel": _sel_0}, "changed": _ch_0};
  } else {
    const _e_0 = _m_0["value"];
    return $pick$(($ent_dead$(_e_0)), {$: "CS", "st": {$: "State", "ents": _es_0, "gates": _gs_0, "sel": _sel_0}, "changed": _ch_0}, {$: "CS", "st": {$: "State", "ents": ($set_ent$(_es_0, ($kill_ent$(_e_0)))), "gates": _gs_0, "sel": _sel_0}, "changed": true});
  }
}

function $commit_kills$($0, $1) {
  for (;;) {
    {
      const _xs_0 = $0;
      const _c_0 = $1;
      if (_xs_0.$ === "Nil") {
        return _c_0;
      } else {
        const _i_0 = _xs_0["head"];
        const _rest_0 = _xs_0["tail"];
        const _t_0 = _c_0["st"];
        const _es_0 = _t_0["ents"];
        const _gs_0 = _t_0["gates"];
        const _sel_0 = _t_0["sel"];
        const _ch_0 = _c_0["changed"];
        $0 = _rest_0;
        $1 = ($commit_kill$(($find$(_es_0, _i_0)), _es_0, _gs_0, _sel_0, _ch_0));
        continue;
      }
    }
  }
}

function $commit_merges$($0, $1) {
  for (;;) {
    {
      const _xs_0 = $0;
      const _c_0 = $1;
      if (_xs_0.$ === "Nil") {
        return _c_0;
      } else {
        const _i_0 = _xs_0["head"];
        const _rest_0 = _xs_0["tail"];
        const _t_0 = _c_0["st"];
        const _es_0 = _t_0["ents"];
        const _gs_0 = _t_0["gates"];
        const _sel_0 = _t_0["sel"];
        $0 = _rest_0;
        $1 = {$: "CS", "st": {$: "State", "ents": ($remove_ent$(_es_0, _i_0)), "gates": _gs_0, "sel": _sel_0}, "changed": true};
        continue;
      }
    }
  }
}

function $commit_repl$($0, $1) {
  for (;;) {
    {
      const _xs_0 = $0;
      const _c_0 = $1;
      if (_xs_0.$ === "Nil") {
        return _c_0;
      } else {
        const _e_0 = _xs_0["head"];
        const _rest_0 = _xs_0["tail"];
        const _t_0 = _c_0["st"];
        const _es_0 = _t_0["ents"];
        const _gs_0 = _t_0["gates"];
        const _sel_0 = _t_0["sel"];
        $0 = _rest_0;
        $1 = {$: "CS", "st": {$: "State", "ents": ($set_ent$(_es_0, _e_0)), "gates": _gs_0, "sel": _sel_0}, "changed": true};
        continue;
      }
    }
  }
}

function $commit_new$($0, $1) {
  for (;;) {
    {
      const _xs_0 = $0;
      const _c_0 = $1;
      if (_xs_0.$ === "Nil") {
        return _c_0;
      } else {
        const _e_0 = _xs_0["head"];
        const _rest_0 = _xs_0["tail"];
        const _t_0 = _c_0["st"];
        const _es_0 = _t_0["ents"];
        const _gs_0 = _t_0["gates"];
        const _sel_0 = _t_0["sel"];
        $0 = _rest_0;
        $1 = {$: "CS", "st": {$: "State", "ents": ($insert_ent$(_es_0, _e_0)), "gates": _gs_0, "sel": _sel_0}, "changed": true};
        continue;
      }
    }
  }
}

function $commit$(_t_0, _lv_0, _st_0) {
  const _ms_0 = _t_0["moves"];
  const _ks_0 = _t_0["kills"];
  const _mg_0 = _t_0["merges"];
  const _rp_0 = _t_0["repl"];
  const _nw_0 = _t_0["news"];
  const _tg_0 = _t_0["gates"];
  return $commit_new$(_nw_0, ($commit_repl$(_rp_0, ($commit_merges$(_mg_0, ($commit_kills$(_ks_0, ($commit_moves$(_ms_0, ($commit_gates$(_tg_0, _lv_0, {$: "CS", "st": _st_0, "changed": false})))))))))));
}

function $can_fall$(_e_0) {
  const _t_0 = _e_0["kind"];
  if (_t_0.$ === "Tree") {
    return false;
  } else if (_t_0.$ === "Sign") {
    return false;
  } else {
    const _d_2 = _e_0["dead"];
    return $Bool$not$(_d_2);
  }
}

function $fall_moves$(_es_0, _lv_0, _st_0) {
  if (_es_0.$ === "Nil") {
    return {$: "Nil"};
  } else {
    const _e_0 = _es_0["head"];
    const _rest_0 = _es_0["tail"];
    const _tl_0 = ($fall_moves$(_rest_0, _lv_0, _st_0));
    return $pick$(($Bool$and$(($can_fall$(_e_0)), ($Bool$not$(($supported$(_lv_0, _st_0, _e_0)))))), {$: "Con", "head": {$: "Mv", "id": ($ent_id$(_e_0)), "to": ($step$({$: "DDown"}, ($ent_at$(_e_0))))}, "tail": _tl_0}, _tl_0);
  }
}

function $drown_one$(_m_0, _lv_0, _es_0) {
  if (_m_0.$ === "None") {
    return _es_0;
  } else {
    const _e_0 = _m_0["value"];
    const _k_0 = ($ent_kind$(_e_0));
    const _x_0 = ($is_guy_kind$(_k_0));
    const _x_1 = ($is_monster_kind$(_k_0));
    const _sink_0 = ($Bool$and$(($Bool$and$((_x_0 || _x_1), ($water$(_lv_0, ($ent_at$(_e_0)))))), ($nat_le$(($pos_z$(($ent_at$(_e_0)))), 1))));
    return $pick$(_sink_0, ($set_ent$(_es_0, ($kill_ent$(_e_0)))), _es_0);
  }
}

function $drown$($0, $1, $2) {
  for (;;) {
    {
      const _xs_0 = $0;
      const _lv_0 = $1;
      const _es_0 = $2;
      if (_xs_0.$ === "Nil") {
        return _es_0;
      } else {
        const _t_0 = _xs_0["head"];
        const _i_0 = _t_0["id"];
        const _rest_0 = _xs_0["tail"];
        $0 = _rest_0;
        $1 = _lv_0;
        $2 = ($drown_one$(($find$(_es_0, _i_0)), _lv_0, _es_0));
        continue;
      }
    }
  }
}

function $guy_alive_ids$(_es_0) {
  if (_es_0.$ === "Nil") {
    return {$: "Nil"};
  } else {
    const _e_0 = _es_0["head"];
    const _rest_0 = _es_0["tail"];
    const _tl_0 = ($guy_alive_ids$(_rest_0));
    return $pick$(($Bool$and$(($is_guy$(_e_0)), ($Bool$not$(($ent_dead$(_e_0)))))), {$: "Con", "head": _e_0, "tail": _tl_0}, _tl_0);
  }
}

function $is_cleric$(_e_0) {
  return $role_is$(($guy_role$(_e_0)), {$: "Cleric"});
}

function $group_ids$(_gs_0, _g_0) {
  if (_gs_0.$ === "Nil") {
    return {$: "Nil"};
  } else {
    const _e_0 = _gs_0["head"];
    const _rest_0 = _gs_0["tail"];
    const _tl_0 = ($group_ids$(_rest_0, _g_0));
    return $pick$(($nat_eq$(($guy_group$(_e_0)), _g_0)), {$: "Con", "head": ($ent_id$(_e_0)), "tail": _tl_0}, _tl_0);
  }
}

function $aura$(_hs_0, _c_0, _all_0) {
  if (_hs_0.$ === "Nil") {
    return {$: "Nil"};
  } else {
    const _h_0 = _hs_0["head"];
    const _rest_0 = _hs_0["tail"];
    const _tl_0 = ($aura$(_rest_0, _c_0, _all_0));
    const _ok_0 = ($Bool$and$(($Bool$and$(($Bool$not$(($nat_eq$(($ent_id$(_h_0)), ($ent_id$(_c_0)))))), ($adjacent$(($ent_at$(_c_0)), ($ent_at$(_h_0)))))), ($Bool$not$(($is_cleric$(_h_0))))));
    return $pick$(_ok_0, ($List$append$(($group_ids$(_all_0, ($guy_group$(_h_0)))), _tl_0)), _tl_0);
  }
}

function $protection$(_cs_0, _all_0) {
  if (_cs_0.$ === "Nil") {
    return {$: "Nil"};
  } else {
    const _c_0 = _cs_0["head"];
    const _rest_0 = _cs_0["tail"];
    const _tl_0 = ($protection$(_rest_0, _all_0));
    return $pick$(($is_cleric$(_c_0)), {$: "Con", "head": ($ent_id$(_c_0)), "tail": ($List$append$(($aura$(_all_0, _c_0, _all_0)), _tl_0))}, _tl_0);
  }
}

function $protected$(_st_0) {
  const _gs_0 = ($guy_alive_ids$(($st_ents$(_st_0))));
  return $protection$(_gs_0, _gs_0);
}

function $presses$(_k_0) {
  if (_k_0.$ === "Sign") {
    return false;
  } else {
    return true;
  }
}

function $pressed$(_es_0, _at_0) {
  return $any_kind_at$1261$(_es_0, _at_0);
}

function $plates_ok$($0, $1, $2, $3) {
  for (;;) {
    {
      const _ps_0 = $0;
      const _es_0 = $1;
      const _f_0 = $2;
      const _acc_0 = $3;
      if (_ps_0.$ === "Nil") {
        return _acc_0;
      } else {
        const _t_0 = _ps_0["head"];
        const _at_0 = _t_0["at"];
        const _g_0 = _t_0["flavor"];
        const _rest_0 = _ps_0["tail"];
        const _a_0 = _acc_0["all"];
        const _s_0 = _acc_0["seen"];
        const _mine_0 = ($nat_eq$(_g_0, _f_0));
        const _x_0 = ($Bool$not$(_mine_0));
        const _x_1 = ($pressed$(_es_0, _at_0));
        $0 = _rest_0;
        $1 = _es_0;
        $2 = _f_0;
        $3 = {$: "PO", "all": ($Bool$and$(_a_0, (_x_0 || _x_1))), "seen": (_s_0 || _mine_0)};
        continue;
      }
    }
  }
}

function $po_all$(_p_0) {
  const _a_0 = _p_0["all"];
  return _a_0;
}

function $po_seen$(_p_0) {
  const _s_0 = _p_0["seen"];
  return _s_0;
}

function $level_plates$(_lv_0) {
  const _ps_0 = _lv_0["plates"];
  return _ps_0;
}

function $pend_open$(_pd_0, _gs_0, _i_0) {
  return $Maybe$default$(($gs_lookup$(_pd_0, _i_0)), ($gate_open_at$(_gs_0, _i_0)));
}

function $any_monster$(_es_0) {
  if (_es_0.$ === "Nil") {
    return false;
  } else {
    const _e_0 = _es_0["head"];
    const _rest_0 = _es_0["tail"];
    const _x_0 = ($Bool$and$(($is_monster_kind$(($ent_kind$(_e_0)))), ($Bool$not$(($ent_dead$(_e_0))))));
    const _x_1 = ($any_monster$(_rest_0));
    return (_x_0 || _x_1);
  }
}

function $bool_xor$(_a_0, _b_0) {
  if (_a_0) {
    return $Bool$not$(_b_0);
  } else {
    return _b_0;
  }
}

function $gate_targets$(_gl_0, _lv_0, _st_0, _pd_0, _monsters_0, _i_0) {
  if (_gl_0.$ === "Nil") {
    return {$: "Nil"};
  } else {
    const _t_0 = _gl_0["head"];
    const _f_0 = _t_0["flavor"];
    const _notted_0 = _t_0["notted"];
    const _mon_0 = _t_0["monster"];
    const _rest_0 = _gl_0["tail"];
    const _tl_0 = ($gate_targets$(_rest_0, _lv_0, _st_0, _pd_0, _monsters_0, nat_chk(_i_0 + 1)));
    const _po_0 = ($plates_ok$(($level_plates$(_lv_0)), ($st_ents$(_st_0)), _f_0, {$: "PO", "all": true, "seen": false}));
    const _want_sw_0 = ($bool_xor$(_notted_0, ($po_all$(_po_0))));
    const _want_mon_0 = ($bool_xor$(_notted_0, ($Bool$not$(($any_monster$(($st_ents$(_st_0))))))));
    const _want_0 = ($pick$(_monsters_0, _want_mon_0, _want_sw_0));
    const _applies_0 = ($pick$(_monsters_0, _mon_0, ($Bool$and$(($Bool$not$(_mon_0)), ($po_seen$(_po_0))))));
    const _differs_0 = ($Bool$not$(($bool_eq$(_want_0, ($pend_open$(_pd_0, ($st_gates$(_st_0)), _i_0))))));
    return $pick$(($Bool$and$(_applies_0, _differs_0)), {$: "Con", "head": {$: "GS", "ix": _i_0, "open": _want_0}, "tail": _tl_0}, _tl_0);
  }
}

function $dir_between$(_a_0, _b_0) {
  return $pick$(($nat_lt$(($pos_c$(_a_0)), ($pos_c$(_b_0)))), {$: "DE"}, ($pick$(($nat_lt$(($pos_c$(_b_0)), ($pos_c$(_a_0)))), {$: "DW"}, ($pick$(($nat_lt$(($pos_r$(_a_0)), ($pos_r$(_b_0)))), {$: "DS"}, ($pick$(($nat_lt$(($pos_r$(_b_0)), ($pos_r$(_a_0)))), {$: "DN"}, ($pick$(($nat_lt$(($pos_z$(_a_0)), ($pos_z$(_b_0)))), {$: "DUp"}, {$: "DDown"})))))))));
}

function $goblin_victims$(_es_0, _lv_0, _g_0) {
  if (_es_0.$ === "Nil") {
    return {$: "Nil"};
  } else {
    const _e_0 = _es_0["head"];
    const _rest_0 = _es_0["tail"];
    const _tl_0 = ($goblin_victims$(_rest_0, _lv_0, _g_0));
    const _k_0 = ($ent_kind$(_e_0));
    const _x_0 = ($is_guy_kind$(_k_0));
    const _x_1 = ($is_monster_kind$(_k_0));
    const _live_0 = ($Bool$and$(($Bool$and$(($Bool$not$(($ent_dead$(_e_0)))), ($Bool$not$(($nat_eq$(($ent_id$(_e_0)), ($ent_id$(_g_0)))))))), (_x_0 || _x_1)));
    const _same_z_0 = ($nat_eq$(($pos_z$(($ent_at$(_e_0)))), ($pos_z$(($ent_at$(_g_0))))));
    const _fenced_0 = ($Bool$and$(_same_z_0, ($fence_blocks$(_lv_0, ($ent_at$(_g_0)), ($dir_between$(($ent_at$(_g_0)), ($ent_at$(_e_0))))))));
    return $pick$(($Bool$and$(($Bool$and$(_live_0, ($adjacent$(($ent_at$(_g_0)), ($ent_at$(_e_0)))))), ($Bool$not$(_fenced_0)))), {$: "Con", "head": ($ent_id$(_e_0)), "tail": _tl_0}, _tl_0);
  }
}

function $roast_ids$(_hs_0) {
  if (_hs_0.$ === "Nil") {
    return {$: "Nil"};
  } else {
    const _h_0 = _hs_0["head"];
    const _rest_0 = _hs_0["tail"];
    const _tl_0 = ($roast_ids$(_rest_0));
    const _k_0 = ($ent_kind$(_h_0));
    const _x_0 = ($is_guy_kind$(_k_0));
    const _x_1 = ($is_monster_kind$(_k_0));
    return $pick$((_x_0 || _x_1), {$: "Con", "head": ($ent_id$(_h_0)), "tail": _tl_0}, _tl_0);
  }
}

function $roast$(_tr_0) {
  const _t_0 = _tr_0["res"];
  if (_t_0.$ === "THit") {
    const _hs_0 = _tr_0["hits"];
    return $roast_ids$(_hs_0);
  } else {
    return {$: "Nil"};
  }
}

function $one_monster$(_k_0, _m_0, _lv_0, _st_0, _breath_0) {
  if (_k_0.$ === "Monster") {
    const _t_0 = _k_0["mk"];
    if (_t_0.$ === "Goblin") {
      const _x_0 = ($ent_dead$(_m_0));
      const _x_1 = ($wall$(_lv_0, ($ent_at$(_m_0))));
      return $pick$((_x_0 || _x_1), {$: "Nil"}, ($goblin_victims$(($st_ents$(_st_0)), _lv_0, _m_0)));
    } else {
      const _d_1 = _k_0["dir"];
      const _x_2 = ($ent_dead$(_m_0));
      const _x_3 = ($wall$(_lv_0, ($ent_at$(_m_0))));
      const _x_4 = (_x_2 || _x_3);
      const _x_5 = ($Bool$not$(_breath_0));
      return $pick$((_x_4 || _x_5), {$: "Nil"}, ($roast$(($trace$(_lv_0, _st_0, ($ent_at$(_m_0)), _d_1, {$: "None"}, {$: "MDragon"}, {$: "Some", "value": ($ent_id$(_m_0))})))));
    }
  } else {
    return {$: "Nil"};
  }
}

function $monster_victims$(_ms_0, _lv_0, _st_0, _breath_0) {
  if (_ms_0.$ === "Nil") {
    return {$: "Nil"};
  } else {
    const _m_0 = _ms_0["head"];
    const _rest_0 = _ms_0["tail"];
    const _tl_0 = ($monster_victims$(_rest_0, _lv_0, _st_0, _breath_0));
    return $List$append$(($one_monster$(($ent_kind$(_m_0)), _m_0, _lv_0, _st_0, _breath_0)), _tl_0);
  }
}

function $is_guy_m$(_m_0) {
  if (_m_0.$ === "None") {
    return false;
  } else {
    const _e_0 = _m_0["value"];
    return $is_guy$(_e_0);
  }
}

function $unprotected$(_vs_0, _prot_0, _es_0) {
  if (_vs_0.$ === "Nil") {
    return {$: "Nil"};
  } else {
    const _v_0 = _vs_0["head"];
    const _rest_0 = _vs_0["tail"];
    const _tl_0 = ($unprotected$(_rest_0, _prot_0, _es_0));
    const _guy_0 = ($is_guy_m$(($find$(_es_0, _v_0))));
    const _dup_0 = ($nat_in$(_tl_0, _v_0));
    const _x_0 = ($Bool$and$(_guy_0, ($nat_in$(_prot_0, _v_0))));
    return $pick$((_x_0 || _dup_0), _tl_0, {$: "Con", "head": _v_0, "tail": _tl_0});
  }
}

function $any_guy_in$(_vs_0, _es_0) {
  if (_vs_0.$ === "Nil") {
    return false;
  } else {
    const _v_0 = _vs_0["head"];
    const _rest_0 = _vs_0["tail"];
    const _x_0 = ($is_guy_m$(($find$(_es_0, _v_0))));
    const _x_1 = ($any_guy_in$(_rest_0, _es_0));
    return (_x_0 || _x_1);
  }
}

function $any_dead_guy$(_es_0) {
  if (_es_0.$ === "Nil") {
    return false;
  } else {
    const _e_0 = _es_0["head"];
    const _rest_0 = _es_0["tail"];
    const _x_0 = ($Bool$and$(($is_guy$(_e_0)), ($ent_dead$(_e_0))));
    const _x_1 = ($any_dead_guy$(_rest_0));
    return (_x_0 || _x_1);
  }
}

function $drop_dead$(_es_0) {
  if (_es_0.$ === "Nil") {
    return {$: "Nil"};
  } else {
    const _e_0 = _es_0["head"];
    const _rest_0 = _es_0["tail"];
    const _tl_0 = ($drop_dead$(_rest_0));
    return $pick$(($Bool$and$(($ent_dead$(_e_0)), ($Bool$not$(($is_guy$(_e_0)))))), _tl_0, {$: "Con", "head": _e_0, "tail": _tl_0});
  }
}

function $tk_breath$(_k_0) {
  if (_k_0.$ === "TLoad") {
    return false;
  } else {
    return true;
  }
}

function $tk_death$(_k_0) {
  if (_k_0.$ === "TDeath") {
    return true;
  } else {
    return false;
  }
}

function $tk_blocking$(_k_0) {
  if (_k_0.$ === "TPlayer") {
    return true;
  } else if (_k_0.$ === "TDeath") {
    return true;
  } else {
    return false;
  }
}

function $tk_fall$(_k_0) {
  if (_k_0.$ === "TFall") {
    return true;
  } else {
    return false;
  }
}

function $tk_gate$(_k_0) {
  if (_k_0.$ === "TGate") {
    return true;
  } else {
    return false;
  }
}

function $tk_load$(_k_0) {
  if (_k_0.$ === "TLoad") {
    return true;
  } else {
    return false;
  }
}

function $txn_kind$(_t_0) {
  const _k_0 = _t_0["kind"];
  return _k_0;
}

function $txn_gates$(_t_0) {
  const _gs_0 = _t_0["gates"];
  return _gs_0;
}

function $gate_txn$(_gs_0) {
  return {$: "Txn", "kind": {$: "TGate"}, "moves": {$: "Nil"}, "kills": {$: "Nil"}, "merges": {$: "Nil"}, "repl": {$: "Nil"}, "news": {$: "Nil"}, "gates": _gs_0};
}

function $death_txn$(_ks_0) {
  return {$: "Txn", "kind": {$: "TDeath"}, "moves": {$: "Nil"}, "kills": _ks_0, "merges": {$: "Nil"}, "repl": {$: "Nil"}, "news": {$: "Nil"}, "gates": {$: "Nil"}};
}

function $gs_drop_all$($0, $1) {
  for (;;) {
    {
      const _xs_0 = $0;
      const _pd_0 = $1;
      if (_xs_0.$ === "Nil") {
        return _pd_0;
      } else {
        const _t_0 = _xs_0["head"];
        const _i_0 = _t_0["ix"];
        const _rest_0 = _xs_0["tail"];
        $0 = _rest_0;
        $1 = ($gs_drop$(_pd_0, _i_0));
        continue;
      }
    }
  }
}

function $gs_update$($0, $1) {
  for (;;) {
    {
      const _xs_0 = $0;
      const _pd_0 = $1;
      if (_xs_0.$ === "Nil") {
        return _pd_0;
      } else {
        const _t_0 = _xs_0["head"];
        const _i_0 = _t_0["ix"];
        const _o_0 = _t_0["open"];
        const _rest_0 = _xs_0["tail"];
        $0 = _rest_0;
        $1 = {$: "Con", "head": {$: "GS", "ix": _i_0, "open": _o_0}, "tail": ($gs_drop$(_pd_0, _i_0))};
        continue;
      }
    }
  }
}

function $opt_txn$(_c_0, _t_0) {
  if (_c_0) {
    return {$: "Con", "head": _t_0, "tail": {$: "Nil"}};
  } else {
    return {$: "Nil"};
  }
}

function $after_pass$(_k_0, _lv_0, _st_0, _pd_0) {
  const _es_0 = ($st_ents$(_st_0));
  const _prot_0 = ($protected$(_st_0));
  const _g_0 = ($gate_targets$(($level_gates$(_lv_0)), _lv_0, _st_0, _pd_0, false, 0));
  const _has_g_0 = ($Bool$not$(($list_empty$(_g_0))));
  const _breath_0 = ($Bool$and$(($Bool$and$(($tk_breath$(_k_0)), ($Bool$not$(($tk_death$(_k_0)))))), ($Bool$not$(($Bool$and$(($tk_blocking$(_k_0)), _has_g_0))))));
  const _kills_0 = ($unprotected$(($monster_victims$(_es_0, _lv_0, _st_0, _breath_0)), _prot_0, _es_0));
  const _pd1_0 = ($gs_update$(_g_0, _pd_0));
  const _m_0 = ($gate_targets$(($level_gates$(_lv_0)), _lv_0, _st_0, _pd1_0, true, 0));
  const _pd2_0 = ($gs_update$(_m_0, _pd1_0));
  const _falls_0 = ($Bool$not$(($list_empty$(($fall_moves$(_es_0, _lv_0, _st_0))))));
  const _q_0 = ($List$append$(($opt_txn$(_has_g_0, ($gate_txn$(_g_0)))), ($List$append$(($opt_txn$(($Bool$not$(($list_empty$(_kills_0)))), ($death_txn$(_kills_0)))), ($List$append$(($opt_txn$(($Bool$not$(($list_empty$(_m_0)))), ($gate_txn$(_m_0)))), ($opt_txn$(_falls_0, ($empty_txn$({$: "TFall"}))))))))));
  const _x_0 = ($any_dead_guy$(_es_0));
  const _x_1 = ($any_guy_in$(_kills_0, _es_0));
  return $pick$((_x_0 || _x_1), {$: "None"}, {$: "Some", "value": {$: "After", "queue": _q_0, "pending": _pd2_0}});
}

function $prepare$(_t_0, _lv_0, _st_0) {
  const _t_1 = _t_0["kind"];
  if (_t_1.$ === "TFall") {
    const _ks_0 = _t_0["kills"];
    const _mg_0 = _t_0["merges"];
    const _rp_0 = _t_0["repl"];
    const _nw_0 = _t_0["news"];
    const _gs_0 = _t_0["gates"];
    return {$: "Txn", "kind": {$: "TFall"}, "moves": ($fall_moves$(($st_ents$(_st_0)), _lv_0, _st_0)), "kills": _ks_0, "merges": _mg_0, "repl": _rp_0, "news": _nw_0, "gates": _gs_0};
  } else {
    const _ms_1 = _t_0["moves"];
    const _ks_1 = _t_0["kills"];
    const _mg_1 = _t_0["merges"];
    const _rp_1 = _t_0["repl"];
    const _nw_1 = _t_0["news"];
    const _gs_1 = _t_0["gates"];
    return {$: "Txn", "kind": _t_1, "moves": _ms_1, "kills": _ks_1, "merges": _mg_1, "repl": _rp_1, "news": _nw_1, "gates": _gs_1};
  }
}

function $with_drowning$(_k_0, _ms_0, _lv_0, _st_0) {
  const _es_0 = _st_0["ents"];
  const _gs_0 = _st_0["gates"];
  const _sel_0 = _st_0["sel"];
  return {$: "State", "ents": ($pick$(($tk_fall$(_k_0)), ($drown$(_ms_0, _lv_0, _es_0)), _es_0)), "gates": _gs_0, "sel": _sel_0};
}

function $finish$(_st_0) {
  const _es_0 = _st_0["ents"];
  const _gs_0 = _st_0["gates"];
  const _sel_0 = _st_0["sel"];
  return $pick$(($any_dead_guy$(_es_0)), {$: "Lost"}, {$: "Settled", "st": {$: "State", "ents": ($drop_dead$(_es_0)), "gates": _gs_0, "sel": _sel_0}});
}

function $continue_after$(_a_0, _st_0, _rest_0) {
  if (_a_0.$ === "None") {
    return {$: "Lost"};
  } else {
    const _t_0 = _a_0["value"];
    const _q_0 = _t_0["queue"];
    const _pd_0 = _t_0["pending"];
    return {$: "Continue", "l": {$: "Loop", "st": _st_0, "queue": ($List$append$(_rest_0, _q_0)), "pending": _pd_0}};
  }
}

function $cs_st$(_c_0) {
  const _s_0 = _c_0["st"];
  return _s_0;
}

function $cs_changed$(_c_0) {
  const _ch_0 = _c_0["changed"];
  return _ch_0;
}

function $one_txn$(_t_0, _lv_0, _st_0, _rest_0, _pd_0) {
  const _t1_0 = ($prepare$(_t_0, _lv_0, _st_0));
  const _k_0 = ($txn_kind$(_t1_0));
  const _pd1_0 = ($pick$(($tk_gate$(_k_0)), ($gs_drop_all$(($txn_gates$(_t1_0)), _pd_0)), _pd_0));
  const _c_0 = ($commit$(_t1_0, _lv_0, _st_0));
  const _s2_0 = ($with_drowning$(_k_0, ($txn_moves$(_t1_0)), _lv_0, ($cs_st$(_c_0))));
  const _x_0 = ($cs_changed$(_c_0));
  const _x_1 = ($tk_load$(_k_0));
  const _go_0 = (_x_0 || _x_1);
  return $pick$(_go_0, ($continue_after$(($after_pass$(_k_0, _lv_0, _s2_0, _pd1_0)), _s2_0, _rest_0)), {$: "Continue", "l": {$: "Loop", "st": _s2_0, "queue": _rest_0, "pending": _pd1_0}});
}

function $settle_loop$($0, $1, $2) {
  for (;;) {
    {
      const _fuel_0 = $0;
      const _lv_0 = $1;
      const _s_0 = $2;
      if (_fuel_0 === 0) {
        if (_s_0.$ === "Lost") {
          return {$: "None"};
        } else if (_s_0.$ === "Settled") {
          const _st_0 = _s_0["st"];
          return {$: "Some", "value": _st_0};
        } else {
          return {$: "None"};
        }
      } else {
        const _f_0 = (_fuel_0 - 1);
        if (_s_0.$ === "Lost") {
          return {$: "None"};
        } else if (_s_0.$ === "Settled") {
          const _st_1 = _s_0["st"];
          return {$: "Some", "value": _st_1};
        } else {
          const _t_0 = _s_0["l"];
          const _st_2 = _t_0["st"];
          const _t_1 = _t_0["queue"];
          if (_t_1.$ === "Nil") {
            $0 = _f_0;
            $1 = _lv_0;
            $2 = ($finish$(_st_2));
            continue;
          } else {
            const _t_2 = _t_1["head"];
            const _rest_0 = _t_1["tail"];
            const _pd_1 = _t_0["pending"];
            $0 = _f_0;
            $1 = _lv_0;
            $2 = ($one_txn$(_t_2, _lv_0, _st_2, _rest_0, _pd_1));
            continue;
          }
        }
      }
    }
  }
}

function $settle$(_lv_0, _st_0, _t_0) {
  return $settle_loop$(256, _lv_0, {$: "Continue", "l": {$: "Loop", "st": _st_0, "queue": {$: "Con", "head": _t_0, "tail": {$: "Nil"}}, "pending": {$: "Nil"}}});
}

function $leader_lt$(_a_0, _b_0) {
  const _oa_0 = _a_0["order"];
  const _ga_0 = _a_0["group"];
  const _ob_0 = _b_0["order"];
  const _gb_0 = _b_0["group"];
  const _x_0 = ($nat_lt$(_oa_0, _ob_0));
  const _x_1 = ($Bool$and$(($nat_eq$(_oa_0, _ob_0)), ($nat_lt$(_ga_0, _gb_0))));
  return (_x_0 || _x_1);
}

function $leader_order$(_l_0) {
  const _o_0 = _l_0["order"];
  return _o_0;
}

function $leader_group$(_l_0) {
  const _g_0 = _l_0["group"];
  return _g_0;
}

function $add_leader$(_xs_0, _l_0) {
  if (_xs_0.$ === "Nil") {
    return {$: "Con", "head": _l_0, "tail": {$: "Nil"}};
  } else {
    const _x_0 = _xs_0["head"];
    const _rest_0 = _xs_0["tail"];
    const _same_0 = ($nat_eq$(($leader_group$(_x_0)), ($leader_group$(_l_0))));
    const _better_0 = ($nat_lt$(($leader_order$(_l_0)), ($leader_order$(_x_0))));
    return $pick$(_same_0, ($pick$(_better_0, {$: "Con", "head": _l_0, "tail": _rest_0}, {$: "Con", "head": _x_0, "tail": _rest_0})), {$: "Con", "head": _x_0, "tail": ($add_leader$(_rest_0, _l_0))});
  }
}

function $insert_leader$(_xs_0, _l_0) {
  if (_xs_0.$ === "Nil") {
    return {$: "Con", "head": _l_0, "tail": {$: "Nil"}};
  } else {
    const _x_0 = _xs_0["head"];
    const _rest_0 = _xs_0["tail"];
    return $pick$(($leader_lt$(_l_0, _x_0)), {$: "Con", "head": _l_0, "tail": {$: "Con", "head": _x_0, "tail": _rest_0}}, {$: "Con", "head": _x_0, "tail": ($insert_leader$(_rest_0, _l_0))});
  }
}

function $sort_leaders$($0, $1) {
  for (;;) {
    {
      const _xs_0 = $0;
      const _acc_0 = $1;
      if (_xs_0.$ === "Nil") {
        return _acc_0;
      } else {
        const _x_0 = _xs_0["head"];
        const _rest_0 = _xs_0["tail"];
        $0 = _rest_0;
        $1 = ($insert_leader$(_acc_0, _x_0));
        continue;
      }
    }
  }
}

function $collect_leaders$($0, $1) {
  for (;;) {
    {
      const _es_0 = $0;
      const _acc_0 = $1;
      if (_es_0.$ === "Nil") {
        return _acc_0;
      } else {
        const _e_0 = _es_0["head"];
        const _rest_0 = _es_0["tail"];
        $0 = _rest_0;
        $1 = ($pick$(($Bool$and$(($is_guy$(_e_0)), ($Bool$not$(($ent_dead$(_e_0)))))), ($add_leader$(_acc_0, {$: "Leader", "order": ($guy_order$(_e_0)), "group": ($guy_group$(_e_0))})), _acc_0));
        continue;
      }
    }
  }
}

function $leaders$(_es_0) {
  return $sort_leaders$(($collect_leaders$(_es_0, {$: "Nil"})), {$: "Nil"});
}

function $first_group$(_ls_0) {
  if (_ls_0.$ === "Nil") {
    return {$: "None"};
  } else {
    const _x_0 = _ls_0["head"];
    return {$: "Some", "value": ($leader_group$(_x_0))};
  }
}

function $next_group$(_ls_0, _all_0, _sel_0) {
  if (_ls_0.$ === "Nil") {
    return $Maybe$default$(($first_group$(_all_0)), _sel_0);
  } else {
    const _x_0 = _ls_0["head"];
    const _rest_0 = _ls_0["tail"];
    const _wrap_0 = ($Maybe$default$(($first_group$(_all_0)), _sel_0));
    return $pick$(($nat_eq$(($leader_group$(_x_0)), _sel_0)), ($Maybe$default$(($first_group$(_rest_0)), _wrap_0)), ($next_group$(_rest_0, _all_0, _sel_0)));
  }
}

function $switch$(_st_0) {
  const _es_0 = _st_0["ents"];
  const _gs_0 = _st_0["gates"];
  const _sel_0 = _st_0["sel"];
  const _ls_0 = ($leaders$(_es_0));
  return $pick$(($nat_lt$(($List$length$(_ls_0)), 2)), {$: "None"}, {$: "Some", "value": {$: "State", "ents": _es_0, "gates": _gs_0, "sel": ($next_group$(_ls_0, _ls_0, _sel_0))}});
}

function $act$(_i_0, _lv_0, _st_0) {
  if (_i_0.$ === "C") {
    return $switch$(_st_0);
  } else if (_i_0.$ === "X") {
    const _t_0 = ($activate$(_lv_0, _st_0));
    return $pick$(($txn_empty$(_t_0)), {$: "None"}, ($settle$(_lv_0, _st_0, _t_0)));
  } else {
    const _t_1 = ($enact$(_lv_0, _st_0, ($input_dir$(_i_0))));
    return $pick$(($txn_empty$(_t_1)), {$: "None"}, ($settle$(_lv_0, _st_0, _t_1)));
  }
}

function $run$($0, $1, $2) {
  for (;;) {
    {
      const _xs_0 = $0;
      const _lv_0 = $1;
      const _m_0 = $2;
      if (_xs_0.$ === "Nil") {
        if (_m_0.$ === "None") {
          return {$: "None"};
        } else {
          const _st_0 = _m_0["value"];
          return {$: "Some", "value": _st_0};
        }
      } else {
        const _i_0 = _xs_0["head"];
        const _rest_0 = _xs_0["tail"];
        if (_m_0.$ === "None") {
          return {$: "None"};
        } else {
          const _st_1 = _m_0["value"];
          $0 = _rest_0;
          $1 = _lv_0;
          $2 = ($act$(_i_0, _lv_0, _st_1));
          continue;
        }
      }
    }
  }
}

function $level_doors$(_lv_0) {
  const _ds_0 = _lv_0["doors"];
  return _ds_0;
}

function $on_door$(_ds_0, _p_0) {
  if (_ds_0.$ === "Nil") {
    return false;
  } else {
    const _d_0 = _ds_0["head"];
    const _rest_0 = _ds_0["tail"];
    const _x_0 = ($pos_eq$(_d_0, _p_0));
    const _x_1 = ($on_door$(_rest_0, _p_0));
    return (_x_0 || _x_1);
  }
}

function $all_on_doors$($0, $1, $2) {
  for (;;) {
    {
      const _es_0 = $0;
      const _ds_0 = $1;
      const _acc_0 = $2;
      if (_es_0.$ === "Nil") {
        return _acc_0;
      } else {
        const _e_0 = _es_0["head"];
        const _rest_0 = _es_0["tail"];
        const _ok_0 = _acc_0["ok"];
        const _n_0 = _acc_0["n"];
        $0 = _rest_0;
        $1 = _ds_0;
        $2 = ($pick$(($is_guy$(_e_0)), {$: "WC", "ok": ($Bool$and$(($Bool$and$(_ok_0, ($Bool$not$(($ent_dead$(_e_0)))))), ($on_door$(_ds_0, ($ent_at$(_e_0)))))), "n": nat_chk(_n_0 + 1)}, {$: "WC", "ok": _ok_0, "n": _n_0}));
        continue;
      }
    }
  }
}

function $wc_won$(_w_0, _ds_0) {
  const _ok_0 = _w_0["ok"];
  const _n_0 = _w_0["n"];
  return $Bool$and$(($Bool$and$(_ok_0, ($Bool$not$(($nat_eq$(_n_0, 0)))))), ($nat_eq$(_n_0, ($List$length$(_ds_0)))));
}

function $won$(_lv_0, _st_0) {
  const _es_0 = _st_0["ents"];
  const _ds_0 = ($level_doors$(_lv_0));
  return $wc_won$(($all_on_doors$(_es_0, _ds_0, {$: "WC", "ok": true, "n": 0})), _ds_0);
}

function $won_m$(_lv_0, _m_0) {
  if (_m_0.$ === "None") {
    return false;
  } else {
    const _st_0 = _m_0["value"];
    return $won$(_lv_0, _st_0);
  }
}

function $snap$($0, $1) {
  for (;;) {
    {
      const _xs_0 = $0;
      const _st_0 = $1;
      if (_xs_0.$ === "Nil") {
        return _st_0;
      } else {
        const _t_0 = _xs_0["head"];
        const _i_0 = _t_0["ix"];
        const _o_0 = _t_0["open"];
        const _rest_0 = _xs_0["tail"];
        const _es_0 = _st_0["ents"];
        const _gs_0 = _st_0["gates"];
        const _sel_0 = _st_0["sel"];
        $0 = _rest_0;
        $1 = {$: "State", "ents": _es_0, "gates": ($set_gate$(_gs_0, _i_0, _o_0)), "sel": _sel_0};
        continue;
      }
    }
  }
}

function $start$(_lv_0, _st_0) {
  const _s1_0 = ($snap$(($gate_targets$(($level_gates$(_lv_0)), _lv_0, _st_0, {$: "Nil"}, false, 0)), _st_0));
  const _s2_0 = ($snap$(($gate_targets$(($level_gates$(_lv_0)), _lv_0, _s1_0, {$: "Nil"}, true, 0)), _s1_0));
  return $settle$(_lv_0, _s2_0, ($empty_txn$({$: "TLoad"})));
}

function $play$(_lv_0, _s0_0, _moves_0) {
  return $won_m$(_lv_0, ($run$(_moves_0, _lv_0, ($start$(_lv_0, _s0_0)))));
}

function $Bool$and$(_a_0, _b_0) {
  if (!_a_0) {
    return false;
  } else {
    return _b_0;
  }
}

function $Bool$not$(_b_0) {
  if (!_b_0) {
    return true;
  } else {
    return false;
  }
}

function $Maybe$default$(_m_0, _d_0) {
  if (_m_0.$ === "None") {
    return _d_0;
  } else {
    const _x_0 = _m_0["value"];
    return _x_0;
  }
}

function $List$append$(_xs_0, _ys_0) {
  if (_xs_0.$ === "Nil") {
    return _ys_0;
  } else {
    const _h_0 = _xs_0["head"];
    const _t_0 = _xs_0["tail"];
    return {$: "Con", "head": _h_0, "tail": ($List$append$(_t_0, _ys_0))};
  }
}

function $List$length$(_xs_0) {
  if (_xs_0.$ === "Nil") {
    return 0;
  } else {
    const _t_0 = _xs_0["tail"];
    return nat_chk(($List$length$(_t_0)) + 1);
  }
}

function $any_kind_at$1260$(_es_0, _p_0) {
  if (_es_0.$ === "Nil") {
    return false;
  } else {
    const _e_0 = _es_0["head"];
    const _rest_0 = _es_0["tail"];
    const _x_0 = ($Bool$and$(($pos_eq$(($ent_at$(_e_0)), _p_0)), ($Bool$and$(($Bool$not$(($ent_dead$(_e_0)))), ($is_tree_kind$(($ent_kind$(_e_0))))))));
    const _x_1 = ($any_kind_at$1260$(_rest_0, _p_0));
    return (_x_0 || _x_1);
  }
}

function $Maybe$or$(_m_0, _n_0) {
  if (_m_0.$ === "None") {
    return _n_0;
  } else {
    const _x_0 = _m_0["value"];
    return {$: "Some", "value": _x_0};
  }
}

function $List$set$(_xs_0, _n_0, _x_0) {
  if (_xs_0.$ === "Nil") {
    return {$: "Nil"};
  } else {
    const _h_0 = _xs_0["head"];
    const _t_0 = _xs_0["tail"];
    if (_n_0 === 0) {
      return {$: "Con", "head": _x_0, "tail": _t_0};
    } else {
      const _p_0 = (_n_0 - 1);
      return {$: "Con", "head": _h_0, "tail": ($List$set$(_t_0, _p_0, _x_0))};
    }
  }
}

function $List$get$($0, $1) {
  for (;;) {
    {
      const _xs_0 = $0;
      const _n_0 = $1;
      if (_xs_0.$ === "Nil") {
        return {$: "None"};
      } else {
        const _h_0 = _xs_0["head"];
        const _t_0 = _xs_0["tail"];
        if (_n_0 === 0) {
          return {$: "Some", "value": _h_0};
        } else {
          const _p_0 = (_n_0 - 1);
          $0 = _t_0;
          $1 = _p_0;
          continue;
        }
      }
    }
  }
}

function $any_kind_at$1261$(_es_0, _p_0) {
  if (_es_0.$ === "Nil") {
    return false;
  } else {
    const _e_0 = _es_0["head"];
    const _rest_0 = _es_0["tail"];
    const _x_0 = ($Bool$and$(($pos_eq$(($ent_at$(_e_0)), _p_0)), ($Bool$and$(($Bool$not$(($ent_dead$(_e_0)))), ($presses$(($ent_kind$(_e_0))))))));
    const _x_1 = ($any_kind_at$1261$(_rest_0, _p_0));
    return (_x_0 || _x_1);
  }
}
export default {
  "pick": run_lib((a0,a1,a2) => $pick$(a0,a1,a2), 3),
  "nat_eq": run_lib((a0,a1) => $nat_eq$(nat_in(a0),nat_in(a1)), 2),
  "nat_lt": run_lib((a0,a1) => $nat_lt$(nat_in(a0),nat_in(a1)), 2),
  "nat_le": run_lib((a0,a1) => $nat_le$(nat_in(a0),nat_in(a1)), 2),
  "nat_dist": run_lib((a0,a1) => $nat_dist$(nat_in(a0),nat_in(a1)), 2),
  "bool_eq": run_lib((a0,a1) => $bool_eq$(a0,a1), 2),
  "pos_eq": run_lib((a0,a1) => $pos_eq$(a0,a1), 2),
  "dir_eq": run_lib((a0,a1) => $dir_eq$(a0,a1), 2),
  "step": run_lib((a0,a1) => $step$(a0,a1), 2),
  "flip": run_lib((a0) => $flip$(a0), 1),
  "cw": run_lib((a0) => $cw$(a0), 1),
  "opposite": run_lib((a0,a1) => $opposite$(a0,a1), 2),
  "pos_c": run_lib((a0) => $pos_c$(a0), 1),
  "pos_r": run_lib((a0) => $pos_r$(a0), 1),
  "pos_z": run_lib((a0) => $pos_z$(a0), 1),
  "adjacent": run_lib((a0,a1) => $adjacent$(a0,a1), 2),
  "chebyshev_le2": run_lib((a0,a1) => $chebyshev_le2$(a0,a1), 2),
  "row_at": run_lib((a0,a1) => $row_at$(a0,nat_in(a1)), 2),
  "tile_in": run_lib((a0,a1) => $tile_in$(a0,nat_in(a1)), 2),
  "bool_row": run_lib((a0,a1) => $bool_row$(a0,nat_in(a1)), 2),
  "bool_in": run_lib((a0,a1) => $bool_in$(a0,nat_in(a1)), 2),
  "tile_of": run_lib((a0) => $tile_of$(a0), 1),
  "tile_row_of": run_lib((a0) => $tile_row_of$(a0), 1),
  "tiles_of": run_lib((a0) => $tiles_of$(a0), 1),
  "top_row_of": run_lib((a0) => $top_row_of$(a0), 1),
  "top_of": run_lib((a0) => $top_of$(a0), 1),
  "tile": run_lib((a0,a1,a2) => $tile$(a0,nat_in(a1),nat_in(a2)), 3),
  "top_wall": run_lib((a0,a1,a2) => $top_wall$(a0,nat_in(a1),nat_in(a2)), 3),
  "is_solid_tile": run_lib((a0) => $is_solid_tile$(a0), 1),
  "is_wall_tile": run_lib((a0) => $is_wall_tile$(a0), 1),
  "is_ground_tile": run_lib((a0) => $is_ground_tile$(a0), 1),
  "is_water_tile": run_lib((a0) => $is_water_tile$(a0), 1),
  "wall_z": run_lib((a0,a1,a2,a3) => $wall_z$(nat_in(a0),a1,nat_in(a2),nat_in(a3)), 4),
  "wall": run_lib((a0,a1) => $wall$(a0,a1), 2),
  "water": run_lib((a0,a1) => $water$(a0,a1), 2),
  "fence_hit": run_lib((a0,a1,a2,a3) => $fence_hit$(a0,a1,a2,a3), 4),
  "is_planar": run_lib((a0) => $is_planar$(a0), 1),
  "fence_blocks": run_lib((a0,a1,a2) => $fence_blocks$(a0,a1,a2), 3),
  "ent_id": run_lib((a0) => $ent_id$(a0), 1),
  "ent_at": run_lib((a0) => $ent_at$(a0), 1),
  "ent_dead": run_lib((a0) => $ent_dead$(a0), 1),
  "ent_kind": run_lib((a0) => $ent_kind$(a0), 1),
  "is_guy_kind": run_lib((a0) => $is_guy_kind$(a0), 1),
  "is_monster_kind": run_lib((a0) => $is_monster_kind$(a0), 1),
  "is_tree_kind": run_lib((a0) => $is_tree_kind$(a0), 1),
  "is_sign_kind": run_lib((a0) => $is_sign_kind$(a0), 1),
  "is_mirror_kind": run_lib((a0) => $is_mirror_kind$(a0), 1),
  "is_rock_kind": run_lib((a0) => $is_rock_kind$(a0), 1),
  "is_movable_kind": run_lib((a0) => $is_movable_kind$(a0), 1),
  "is_blocker_kind": run_lib((a0) => $is_blocker_kind$(a0), 1),
  "is_movable": run_lib((a0) => $is_movable$(a0), 1),
  "is_guy": run_lib((a0) => $is_guy$(a0), 1),
  "guy_group": run_lib((a0) => $guy_group$(a0), 1),
  "guy_order": run_lib((a0) => $guy_order$(a0), 1),
  "guy_role": run_lib((a0) => $guy_role$(a0), 1),
  "role_is": run_lib((a0,a1) => $role_is$(a0,a1), 2),
  "find": run_lib((a0,a1) => $find$(a0,nat_in(a1)), 2),
  "at": run_lib((a0,a1) => $at$(a0,a1), 2),
  "set_ent": run_lib((a0,a1) => $set_ent$(a0,a1), 2),
  "remove_ent": run_lib((a0,a1) => $remove_ent$(a0,nat_in(a1)), 2),
  "insert_ent": run_lib((a0,a1) => $insert_ent$(a0,a1), 2),
  "max_id": run_lib((a0,a1) => $max_id$(a0,nat_in(a1)), 2),
  "move_ent": run_lib((a0,a1) => $move_ent$(a0,a1), 2),
  "kill_ent": run_lib((a0) => $kill_ent$(a0), 1),
  "gate_open_at": run_lib((a0,a1) => $gate_open_at$(a0,nat_in(a1)), 2),
  "gate_index": run_lib((a0,a1,a2) => $gate_index$(a0,a1,nat_in(a2)), 3),
  "gs_lookup": run_lib((a0,a1) => $gs_lookup$(a0,nat_in(a1)), 2),
  "gs_drop": run_lib((a0,a1) => $gs_drop$(a0,nat_in(a1)), 2),
  "closed_at_index": run_lib((a0,a1,a2) => $closed_at_index$(a0,a1,a2), 3),
  "closed_gate": run_lib((a0,a1,a2,a3) => $closed_gate$(a0,a1,a2,a3), 4),
  "mv_has": run_lib((a0,a1) => $mv_has$(a0,nat_in(a1)), 2),
  "mv_get": run_lib((a0,a1) => $mv_get$(a0,nat_in(a1)), 2),
  "mv_put": run_lib((a0,a1,a2) => $mv_put$(a0,nat_in(a1),a2), 3),
  "alive_id": run_lib((a0,a1) => $alive_id$(a0,nat_in(a1)), 2),
  "mv_into": run_lib((a0,a1,a2,a3) => $mv_into$(a0,a1,a2,nat_in(a3)), 4),
  "empty_txn": run_lib((a0) => $empty_txn$(a0), 1),
  "txn_moves": run_lib((a0) => $txn_moves$(a0), 1),
  "txn_with_moves": run_lib((a0,a1) => $txn_with_moves$(a0,a1), 2),
  "list_empty": run_lib((a0) => $list_empty$(a0), 1),
  "txn_empty": run_lib((a0) => $txn_empty$(a0), 1),
  "st_ents": run_lib((a0) => $st_ents$(a0), 1),
  "st_gates": run_lib((a0) => $st_gates$(a0), 1),
  "st_sel": run_lib((a0) => $st_sel$(a0), 1),
  "nat_in": run_lib((a0,a1) => $nat_in$(a0,nat_in(a1)), 2),
  "is_some_nat": run_lib((a0,a1) => $is_some_nat$(a0,nat_in(a1)), 2),
  "is_own_gate": run_lib((a0,a1) => $is_own_gate$(a0,a1), 2),
  "cell_ok": run_lib((a0,a1,a2,a3,a4,a5,a6,a7,a8) => $cell_ok$(a0,a1,a2,nat_in(a3),a4,a5,a6,a7,a8), 9),
  "frame_cell": run_lib((a0) => $frame_cell$(a0), 1),
  "push_occupant": run_lib((a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11) => $push_occupant$(a0,a1,a2,a3,a4,a5,a6,nat_in(a7),a8,a9,a10,a11), 12),
  "push_frame": run_lib((a0,a1,a2,a3,a4,a5,a6,a7,a8) => $push_frame$(a0,a1,a2,a3,a4,a5,a6,a7,a8), 9),
  "push_loop": run_lib((a0,a1,a2,a3,a4,a5,a6,a7) => $push_loop$(nat_in(a0),a1,a2,a3,a4,a5,a6,a7), 8),
  "can_push": run_lib((a0,a1,a2,a3,a4,a5,a6,a7,a8) => $can_push$(a0,a1,a2,a3,nat_in(a4),a5,a6,a7,a8), 9),
  "scan_np": run_lib((a0,a1,a2,a3) => $scan_np$(a0,nat_in(a1),a2,a3), 4),
  "can_step": run_lib((a0,a1,a2,a3,a4,a5,a6,a7,a8) => $can_step$(a0,a1,a2,a3,nat_in(a4),a5,a6,a7,a8), 9),
  "supports_kind": run_lib((a0) => $supports_kind$(a0), 1),
  "support_ent": run_lib((a0,a1,a2) => $support_ent$(a0,a1,nat_in(a2)), 3),
  "supported": run_lib((a0,a1,a2) => $supported$(a0,a1,a2), 3),
  "level_walk_water": run_lib((a0) => $level_walk_water$(a0), 1),
  "support_ok": run_lib((a0,a1,a2,a3) => $support_ok$(a0,a1,a2,a3), 4),
  "stack_weight": run_lib((a0,a1,a2,a3) => $stack_weight$(nat_in(a0),a1,a2,nat_in(a3)), 4),
  "weight_m": run_lib((a0,a1) => $weight_m$(a0,a1), 2),
  "weight_of": run_lib((a0,a1) => $weight_of$(a0,a1), 2),
  "is_mirror_mode": run_lib((a0) => $is_mirror_mode$(a0), 1),
  "mirror_faces_a": run_lib((a0) => $mirror_faces_a$(a0), 1),
  "mirror_faces_b": run_lib((a0) => $mirror_faces_b$(a0), 1),
  "bounce": run_lib((a0,a1) => $bounce$(a0,a1), 2),
  "mirror_scan": run_lib((a0,a1) => $mirror_scan$(a0,a1), 2),
  "scan_beam_ent": run_lib((a0,a1,a2,a3,a4,a5) => $scan_beam_ent$(a0,a1,a2,a3,a4,a5), 6),
  "scan_beam": run_lib((a0,a1,a2,a3,a4) => $scan_beam$(a0,a1,a2,a3,a4), 5),
  "maybe_dir": run_lib((a0,a1) => $maybe_dir$(a0,a1), 2),
  "is_some_dir": run_lib((a0) => $is_some_dir$(a0), 1),
  "reached_max": run_lib((a0,a1) => $reached_max$(a0,nat_in(a1)), 2),
  "level_fuel": run_lib((a0) => $level_fuel$(a0), 1),
  "decide_scan": run_lib((a0,a1,a2,a3,a4,a5,a6,a7,a8,a9) => $decide_scan$(a0,a1,a2,a3,a4,a5,nat_in(a6),a7,a8,a9), 10),
  "decide": run_lib((a0,a1,a2,a3,a4,a5,a6,a7,a8,a9) => $decide$(a0,a1,a2,a3,a4,nat_in(a5),a6,a7,a8,a9), 10),
  "trace_loop": run_lib((a0,a1,a2,a3,a4,a5,a6,a7) => $trace_loop$(nat_in(a0),a1,a2,a3,a4,a5,a6,a7), 8),
  "trace": run_lib((a0,a1,a2,a3,a4,a5,a6) => $trace$(a0,a1,a2,a3,a4,a5,a6), 7),
  "input_dir": run_lib((a0) => $input_dir$(a0), 1),
  "frontness": run_lib((a0,a1) => $frontness$(a0,a1), 2),
  "insert_front": run_lib((a0,a1,a2) => $insert_front$(a0,a1,a2), 3),
  "sort_front": run_lib((a0,a1,a2) => $sort_front$(a0,a1,a2), 3),
  "group_members": run_lib((a0,a1) => $group_members$(a0,nat_in(a1)), 2),
  "role_skill": run_lib((a0) => $role_skill$(a0), 1),
  "push_allowed": run_lib((a0,a1) => $push_allowed$(a0,nat_in(a1)), 2),
  "mv_target_of": run_lib((a0,a1) => $mv_target_of$(a0,a1), 2),
  "add_moves": run_lib((a0,a1,a2,a3) => $add_moves$(a0,a1,a2,a3), 4),
  "first_movable": run_lib((a0) => $first_movable$(a0), 1),
  "pull_with": run_lib((a0,a1,a2,a3,a4,a5) => $pull_with$(a0,a1,a2,a3,a4,a5), 6),
  "pull": run_lib((a0,a1,a2,a3,a4) => $pull$(a0,a1,a2,a3,a4), 5),
  "transmute": run_lib((a0) => $transmute$(a0), 1),
  "first_transmute": run_lib((a0) => $first_transmute$(a0), 1),
  "any_moving": run_lib((a0,a1) => $any_moving$(a0,a1), 2),
  "txn_add_repl": run_lib((a0,a1) => $txn_add_repl$(a0,a1), 2),
  "druid_bump": run_lib((a0,a1,a2,a3,a4) => $druid_bump$(a0,a1,a2,a3,a4), 5),
  "walk_pushed": run_lib((a0,a1,a2,a3,a4,a5) => $walk_pushed$(a0,a1,a2,a3,a4,a5), 6),
  "walk": run_lib((a0,a1,a2,a3,a4) => $walk$(a0,a1,a2,a3,a4), 5),
  "drop_id": run_lib((a0,a1) => $drop_id$(a0,nat_in(a1)), 2),
  "swap_moves": run_lib((a0,a1,a2) => $swap_moves$(a0,a1,a2), 3),
  "wizard_swap": run_lib((a0,a1,a2,a3) => $wizard_swap$(a0,a1,a2,a3), 4),
  "charm_back": run_lib((a0,a1,a2) => $charm_back$(a0,a1,a2), 3),
  "charm_key": run_lib((a0,a1,a2) => $charm_key$(a0,a1,a2), 3),
  "charm_rock": run_lib((a0) => $charm_rock$(a0), 1),
  "charmable": run_lib((a0,a1,a2) => $charmable$(a0,a1,a2), 3),
  "charm_set": run_lib((a0,a1,a2) => $charm_set$(a0,a1,a2), 3),
  "insert_charm": run_lib((a0,a1,a2,a3) => $insert_charm$(a0,a1,a2,a3), 4),
  "sort_charm": run_lib((a0,a1,a2,a3) => $sort_charm$(a0,a1,a2,a3), 4),
  "charm_moves": run_lib((a0,a1,a2,a3,a4,a5) => $charm_moves$(a0,a1,a2,a3,a4,a5), 6),
  "insert_charm_last": run_lib((a0,a1,a2,a3) => $insert_charm_last$(a0,a1,a2,a3), 4),
  "bard_step": run_lib((a0,a1,a2,a3,a4) => $bard_step$(a0,a1,a2,a3,a4), 5),
  "enact_role": run_lib((a0,a1,a2,a3,a4,a5) => $enact_role$(a0,a1,a2,a3,a4,a5), 6),
  "enact_all": run_lib((a0,a1,a2,a3,a4) => $enact_all$(a0,a1,a2,a3,a4), 5),
  "enact": run_lib((a0,a1,a2) => $enact$(a0,a1,a2), 3),
  "seen_of": run_lib((a0,a1) => $seen_of$(a0,a1), 2),
  "choose": run_lib((a0,a1) => $choose$(a0,a1), 2),
  "is_end": run_lib((a0) => $is_end$(a0), 1),
  "mirage_from": run_lib((a0,a1,a2,a3,a4,a5) => $mirage_from$(a0,a1,nat_in(a2),a3,a4,a5), 6),
  "mirage_of": run_lib((a0,a1,a2) => $mirage_of$(a0,a1,a2), 3),
  "mirror_mirage": run_lib((a0,a1,a2) => $mirror_mirage$(a0,a1,a2), 3),
  "mirage_cons": run_lib((a0,a1) => $mirage_cons$(a0,a1), 2),
  "mirages": run_lib((a0,a1,a2) => $mirages$(a0,a1,a2), 3),
  "clones_match": run_lib((a0,a1) => $clones_match$(a0,a1), 2),
  "all_valid": run_lib((a0) => $all_valid$(a0), 1),
  "clash_with": run_lib((a0,a1,a2) => $clash_with$(a0,a1,a2), 3),
  "any_clash": run_lib((a0) => $any_clash$(a0), 1),
  "placed_at": run_lib((a0,a1) => $placed_at$(a0,a1), 2),
  "merge_test": run_lib((a0,a1) => $merge_test$(a0,a1), 2),
  "same_id": run_lib((a0,a1) => $same_id$(a0,a1), 2),
  "set_id": run_lib((a0,a1) => $set_id$(a0,nat_in(a1)), 2),
  "apply_mirage": run_lib((a0,a1) => $apply_mirage$(a0,a1), 2),
  "apply_mirages": run_lib((a0,a1) => $apply_mirages$(a0,a1), 2),
  "astate_txn": run_lib((a0) => $astate_txn$(a0), 1),
  "activate": run_lib((a0,a1) => $activate$(a0,a1), 2),
  "set_gate": run_lib((a0,a1,a2) => $set_gate$(a0,nat_in(a1),a2), 3),
  "gate_info": run_lib((a0,a1) => $gate_info$(a0,nat_in(a1)), 2),
  "level_gates": run_lib((a0) => $level_gates$(a0), 1),
  "shift_one": run_lib((a0,a1,a2) => $shift_one$(a0,a1,a2), 3),
  "shift_all": run_lib((a0,a1,a2) => $shift_all$(a0,a1,a2), 3),
  "destroy": run_lib((a0,a1) => $destroy$(a0,a1), 2),
  "close_result": run_lib((a0,a1,a2) => $close_result$(a0,a1,a2), 3),
  "close_gate": run_lib((a0,a1,a2) => $close_gate$(a0,a1,a2), 3),
  "commit_gates": run_lib((a0,a1,a2) => $commit_gates$(a0,a1,a2), 3),
  "commit_move": run_lib((a0,a1,a2,a3,a4,a5) => $commit_move$(a0,a1,a2,a3,nat_in(a4),a5), 6),
  "commit_moves": run_lib((a0,a1) => $commit_moves$(a0,a1), 2),
  "commit_kill": run_lib((a0,a1,a2,a3,a4) => $commit_kill$(a0,a1,a2,nat_in(a3),a4), 5),
  "commit_kills": run_lib((a0,a1) => $commit_kills$(a0,a1), 2),
  "commit_merges": run_lib((a0,a1) => $commit_merges$(a0,a1), 2),
  "commit_repl": run_lib((a0,a1) => $commit_repl$(a0,a1), 2),
  "commit_new": run_lib((a0,a1) => $commit_new$(a0,a1), 2),
  "commit": run_lib((a0,a1,a2) => $commit$(a0,a1,a2), 3),
  "can_fall": run_lib((a0) => $can_fall$(a0), 1),
  "fall_moves": run_lib((a0,a1,a2) => $fall_moves$(a0,a1,a2), 3),
  "drown_one": run_lib((a0,a1,a2) => $drown_one$(a0,a1,a2), 3),
  "drown": run_lib((a0,a1,a2) => $drown$(a0,a1,a2), 3),
  "guy_alive_ids": run_lib((a0) => $guy_alive_ids$(a0), 1),
  "is_cleric": run_lib((a0) => $is_cleric$(a0), 1),
  "group_ids": run_lib((a0,a1) => $group_ids$(a0,nat_in(a1)), 2),
  "aura": run_lib((a0,a1,a2) => $aura$(a0,a1,a2), 3),
  "protection": run_lib((a0,a1) => $protection$(a0,a1), 2),
  "protected": run_lib((a0) => $protected$(a0), 1),
  "presses": run_lib((a0) => $presses$(a0), 1),
  "pressed": run_lib((a0,a1) => $pressed$(a0,a1), 2),
  "plates_ok": run_lib((a0,a1,a2,a3) => $plates_ok$(a0,a1,nat_in(a2),a3), 4),
  "po_all": run_lib((a0) => $po_all$(a0), 1),
  "po_seen": run_lib((a0) => $po_seen$(a0), 1),
  "level_plates": run_lib((a0) => $level_plates$(a0), 1),
  "pend_open": run_lib((a0,a1,a2) => $pend_open$(a0,a1,nat_in(a2)), 3),
  "any_monster": run_lib((a0) => $any_monster$(a0), 1),
  "bool_xor": run_lib((a0,a1) => $bool_xor$(a0,a1), 2),
  "gate_targets": run_lib((a0,a1,a2,a3,a4,a5) => $gate_targets$(a0,a1,a2,a3,a4,nat_in(a5)), 6),
  "dir_between": run_lib((a0,a1) => $dir_between$(a0,a1), 2),
  "goblin_victims": run_lib((a0,a1,a2) => $goblin_victims$(a0,a1,a2), 3),
  "roast_ids": run_lib((a0) => $roast_ids$(a0), 1),
  "roast": run_lib((a0) => $roast$(a0), 1),
  "one_monster": run_lib((a0,a1,a2,a3,a4) => $one_monster$(a0,a1,a2,a3,a4), 5),
  "monster_victims": run_lib((a0,a1,a2,a3) => $monster_victims$(a0,a1,a2,a3), 4),
  "is_guy_m": run_lib((a0) => $is_guy_m$(a0), 1),
  "unprotected": run_lib((a0,a1,a2) => $unprotected$(a0,a1,a2), 3),
  "any_guy_in": run_lib((a0,a1) => $any_guy_in$(a0,a1), 2),
  "any_dead_guy": run_lib((a0) => $any_dead_guy$(a0), 1),
  "drop_dead": run_lib((a0) => $drop_dead$(a0), 1),
  "tk_breath": run_lib((a0) => $tk_breath$(a0), 1),
  "tk_death": run_lib((a0) => $tk_death$(a0), 1),
  "tk_blocking": run_lib((a0) => $tk_blocking$(a0), 1),
  "tk_fall": run_lib((a0) => $tk_fall$(a0), 1),
  "tk_gate": run_lib((a0) => $tk_gate$(a0), 1),
  "tk_load": run_lib((a0) => $tk_load$(a0), 1),
  "txn_kind": run_lib((a0) => $txn_kind$(a0), 1),
  "txn_gates": run_lib((a0) => $txn_gates$(a0), 1),
  "gate_txn": run_lib((a0) => $gate_txn$(a0), 1),
  "death_txn": run_lib((a0) => $death_txn$(a0), 1),
  "gs_drop_all": run_lib((a0,a1) => $gs_drop_all$(a0,a1), 2),
  "gs_update": run_lib((a0,a1) => $gs_update$(a0,a1), 2),
  "opt_txn": run_lib((a0,a1) => $opt_txn$(a0,a1), 2),
  "after_pass": run_lib((a0,a1,a2,a3) => $after_pass$(a0,a1,a2,a3), 4),
  "prepare": run_lib((a0,a1,a2) => $prepare$(a0,a1,a2), 3),
  "with_drowning": run_lib((a0,a1,a2,a3) => $with_drowning$(a0,a1,a2,a3), 4),
  "finish": run_lib((a0) => $finish$(a0), 1),
  "continue_after": run_lib((a0,a1,a2) => $continue_after$(a0,a1,a2), 3),
  "cs_st": run_lib((a0) => $cs_st$(a0), 1),
  "cs_changed": run_lib((a0) => $cs_changed$(a0), 1),
  "one_txn": run_lib((a0,a1,a2,a3,a4) => $one_txn$(a0,a1,a2,a3,a4), 5),
  "settle_loop": run_lib((a0,a1,a2) => $settle_loop$(nat_in(a0),a1,a2), 3),
  "settle": run_lib((a0,a1,a2) => $settle$(a0,a1,a2), 3),
  "leader_lt": run_lib((a0,a1) => $leader_lt$(a0,a1), 2),
  "leader_order": run_lib((a0) => $leader_order$(a0), 1),
  "leader_group": run_lib((a0) => $leader_group$(a0), 1),
  "add_leader": run_lib((a0,a1) => $add_leader$(a0,a1), 2),
  "insert_leader": run_lib((a0,a1) => $insert_leader$(a0,a1), 2),
  "sort_leaders": run_lib((a0,a1) => $sort_leaders$(a0,a1), 2),
  "collect_leaders": run_lib((a0,a1) => $collect_leaders$(a0,a1), 2),
  "leaders": run_lib((a0) => $leaders$(a0), 1),
  "first_group": run_lib((a0) => $first_group$(a0), 1),
  "next_group": run_lib((a0,a1,a2) => $next_group$(a0,a1,nat_in(a2)), 3),
  "switch": run_lib((a0) => $switch$(a0), 1),
  "act": run_lib((a0,a1,a2) => $act$(a0,a1,a2), 3),
  "run": run_lib((a0,a1,a2) => $run$(a0,a1,a2), 3),
  "level_doors": run_lib((a0) => $level_doors$(a0), 1),
  "on_door": run_lib((a0,a1) => $on_door$(a0,a1), 2),
  "all_on_doors": run_lib((a0,a1,a2) => $all_on_doors$(a0,a1,a2), 3),
  "wc_won": run_lib((a0,a1) => $wc_won$(a0,a1), 2),
  "won": run_lib((a0,a1) => $won$(a0,a1), 2),
  "won_m": run_lib((a0,a1) => $won_m$(a0,a1), 2),
  "snap": run_lib((a0,a1) => $snap$(a0,a1), 2),
  "start": run_lib((a0,a1) => $start$(a0,a1), 2),
  "play": run_lib((a0,a1,a2) => $play$(a0,a1,a2), 3),
};
