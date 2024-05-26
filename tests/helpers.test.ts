import { dataset_get } from '../src/utils/helpers';

describe('dataset_get function', () => {
  test('should return defaults if element is null or undefined', () => {
    expect(dataset_get(null, 'test', 'default')).toBe('default');
    expect(dataset_get(undefined, 'test', 'default')).toBe('default');
  });

  test('should return defaults if dataset attribute is not found', () => {
    const element = document.createElement('div');
    expect(dataset_get(element, 'test', 'default')).toBe('default');
  });

  test('should return value from dataset attribute', () => {
    const element = document.createElement('div');
    element.setAttribute('data-test', 'value');
    expect(dataset_get(element, 'test', 'default')).toBe('value');
  });

  test('should return parsed JSON value if toJson parameter is true', () => {
    const element = document.createElement('div');
    element.setAttribute('data-test', '{"key": "value"}');
    expect(dataset_get(element, 'test', 'default', true)).toEqual({
      key: 'value',
    });
  });

  test('should return defaults if parsed JSON value is invalid', () => {
    const element = document.createElement('div');
    element.setAttribute('data-test', '{invalidJson}');
    expect(dataset_get(element, 'test', 'default', true)).toBe('default');
  });
});
