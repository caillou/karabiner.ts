import {
  ifApp,
  map,
  ModifierParam,
  rule,
  withModifier,
  writeToProfile,
} from 'karabiner.ts'

const layer = (modifier: ModifierParam) =>
  withModifier(
    modifier,
    'any',
  )([
    map('j').to('left_arrow'),
    map('k').to('down_arrow'),
    map('l').to('right_arrow'),
    map('i').to('up_arrow'),
    map('h').to('delete_or_backspace'),
    map('u').to('[', ['left_command', 'left_shift']),
    map('o').to(']', ['left_command', 'left_shift']),
    map('v').to('v', ['left_control', 'left_option']),
  ])

const ifRemoteDesktop = ifApp(
  '^(com.microsoft.rdc.macos)|(com.p5sys.jump.mac.)',
)

writeToProfile('caillou', [
  rule('Right ⌘ layer', ifRemoteDesktop.unless()).manipulators([
    layer({ right: '⌘' }),
  ]),
  rule('Right ⌥ layer').manipulators([
    withModifier('right_option')([
      map('v').to('v', ['left_control', 'left_option']),
    ]),
  ]),
  rule('CAPS_LOCK to esc/control', ifRemoteDesktop.unless()).manipulators([
    map('caps_lock', null, 'any').to('left_control').toIfAlone('escape'),
  ]),

  rule('Remote Desktop', ifRemoteDesktop).manipulators([
    map('left_command', null, 'any').to('left_control'),
    map('right_command', null, 'any').to('right_control'),
    map('left_control', null, 'any').to('left_command'),
    map('4', ['left_control', 'left_shift']).to('4', [
      'left_command',
      'left_shift',
    ]),
    withModifier('left_control')([map('tab').to('tab', ['left_command'])]),
    // Command + Option + i opens dev tools.
    map('i', ['left_control', 'left_option']).to('i', [
      'left_shift',
      'left_control',
    ]),
    layer('right_control'),
    map('caps_lock', null, 'any').to('left_command').toIfAlone('escape'),
    // map('left_arrow', ['left_control'], 'any').to('home'),
  ]),
])

/*
Karabiner-Elements profile parameters can also be set by the 3rd parameter
of writeToProfile('profileName', [ rules ], { params }). The default values are:

// Karabiner-Elements parameters
'basic.to_if_alone_timeout_milliseconds': 1000,
'basic.to_if_held_down_threshold_milliseconds': 500,
'basic.to_delayed_action_delay_milliseconds': 500,
'basic.simultaneous_threshold_milliseconds': 50,
'mouse_motion_to_scroll.speed': 100,

// karabiner.ts only parameters
//   for simlayer()
'simlayer.threshold_milliseconds': 200
//   for mapDoubleTap()
'double_tap.delay_milliseconds': 200,

// If you type fast, use simlayer instead, see https://github.com/yqrashawn/GokuRakuJoudo/blob/master/tutorial.md#simlayers
  simlayer('z', 'emoji-mode').manipulators([
    map('m').toPaste('🔀'), // Merge branches
  ]),

  // In Karabiner-Elements a 'rule' is a group of manipulators.
  // layer() and simlayer() are extended rule().
  rule('Shell command').manipulators([
    // Use to$() to run a shell command
    map('⎋', 'Hyper').to$('rm -rf ~/wip'),
    // toApp() is shortcut for to$('open -a {app}.app')
    map('f', 'Meh').toApp('Finder'),
  ]),

  // There are multiple ways of using modifiers
  rule('Modifiers').manipulators([
    // You can use their key_code
    map('a', ['left_command', 'left_option']).to('b', ['fn']),
    // Or alias (easier to write if mapped to a layer)
    map('a', { left: '⌘⌥' }).to('b', 'fn'),
    // Or if it can be either left or right side:
    map('a', '⌘⌥').to('b', 'fn'),

    // 'Hyper' is ⌘⌥⌃⇧ and 'Meh' is ⌥⌃⇧
    // ⚠️ Note: Modifier alias (command|option|control|shift and ⌘⌥⌃⇧)
    //          can only be used as modifiers, but not as key_code
    map('right_command').toHyper(),
    map('⇪').toMeh().toIfAlone('⇪'),
    map('a', 'Hyper').to('b', 'Meh'),

    // Add optional modifiers after the mandatory modifiers. About optional modifiers:
    // https://karabiner-elements.pqrs.org/docs/json/complex-modifications-manipulator-definition/from/modifiers/#frommodifiersoptional
    map('a', '⌘', 'any').to('b'), // ⌘⇧a -> ⇧b
  ]),

  // Rules can have conditions which will be added to all manipulators.
  rule('Conditions', ifApp('^com.apple.finder$')).manipulators([
    // manipulators can also have multiple conditions
    // layer/simlayer are behind a 'variable_if' condition.
    // use unless() to switch {condition}_if to {condition}_unless
    map(0).to(1).condition(ifVar('vi-mode'), ifVar('stop').unless()),
  ]),

  // Optional parameters can be set when use
  // - from.simultaneous  - basic.simultaneous_threshold_milliseconds
  // - to_if_alone        - basic.to_if_alone_timeout_milliseconds
  // - to_if_held_down    - basic.to_if_held_down_threshold_milliseconds
  // - to_delayed_action  - basic.to_delayed_action_delay_milliseconds
  rule('Parameters').manipulators([
    map('left_option')
      .toIfAlone('r', '⌘')
      .parameters({ 'basic.to_if_alone_timeout_milliseconds': 500 }),
  ]),

  // There are some other useful abstractions over the json config.
  // [File an issue](https://github.com/evan-liu/karabiner.ts/issues) to suggest more.
  rule('Other abstractions').manipulators([
    // Move the mouse cursor to a position and (optionally) to a screen.
    map('↑', 'Meh').toMouseCursorPosition({ x: '100%', y: 0 }),
    map('→', 'Meh').toMouseCursorPosition({ x: '50%', y: '50%', screen: 1 }),
  ]),

  // There are also some useful utilities
  rule('Utility').manipulators([
    // For nested conditions inside rules/layers
    map(0).to(1).condition(ifVar('a')),
    // You can group them using withCondition()
    withCondition(ifVar('a'))([
      map(0).to(1),
      map(1).to(2).condition(ifApp('X').unless()), // And nest more conditions.
    ]),

    // Use withMapper() to apply the same mapping
    withMapper({ c: 'Calendar', f: 'Finder' })((k, v) =>
      map(k, 'Meh').toApp(v),
    ),

    // And some others like double-tap
    mapDoubleTap(1).to('w', '⌘'),
  ]),

 */
