import { describe, expect, it, vi } from 'vitest';
import { registerServiceWorker } from './serviceWorker';

describe('registerServiceWorker', () => {
  it.each([
    ['/ielts-vocabulary/', '/ielts-vocabulary/sw.js'],
    ['/', '/sw.js']
  ])('waits for load before registering %s from the supplied base', (base, serviceWorkerUrl) => {
    const testWindow = new EventTarget() as Window;
    const register = vi.fn().mockResolvedValue(undefined);
    const testNavigator = {
      serviceWorker: { register }
    } as unknown as Navigator;

    registerServiceWorker(base, testWindow, testNavigator);

    expect(register).not.toHaveBeenCalled();

    testWindow.dispatchEvent(new Event('load'));

    expect(register).toHaveBeenCalledWith(serviceWorkerUrl);
  });

  it('does nothing when service workers are unavailable', () => {
    const addEventListener = vi.fn();
    const testWindow = { addEventListener } as unknown as Window;
    const testNavigator = {} as Navigator;

    registerServiceWorker('/ielts-vocabulary/', testWindow, testNavigator);

    expect(addEventListener).not.toHaveBeenCalled();
  });

  it('catches registration failures', () => {
    const testWindow = new EventTarget() as Window;
    const catchRegistrationFailure = vi.fn();
    const register = vi.fn().mockReturnValue({ catch: catchRegistrationFailure });
    const testNavigator = {
      serviceWorker: { register }
    } as unknown as Navigator;

    registerServiceWorker('/ielts-vocabulary/', testWindow, testNavigator);
    testWindow.dispatchEvent(new Event('load'));

    expect(catchRegistrationFailure).toHaveBeenCalledWith(expect.any(Function));

    const [handleRegistrationFailure] = catchRegistrationFailure.mock.calls[0];

    expect(handleRegistrationFailure(new Error('registration failed'))).toBeUndefined();
  });
});
