export var uuidRegExp = new RegExp('[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}');

export function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export function removeClass(el, className){
  el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
  return el;
}

export function hasClass(el, className){
  return new RegExp('(^| )' + className + '( |$)', 'gi').test(el.className);
}

export function addClass(el, className){
  el.className += ` ${className}`;
  return el;
}



