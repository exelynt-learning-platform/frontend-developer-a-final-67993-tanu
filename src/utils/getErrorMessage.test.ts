import { IMAGE_TOO_LARGE_MESSAGE, getErrorMessage } from './getErrorMessage'

describe('getErrorMessage', () => {
  it('explains when the save payload is too large', () => {
    expect(
      getErrorMessage(
        { status: 413, data: 'Payload Too Large' },
        'Unable to save employee.',
      ),
    ).toBe(IMAGE_TOO_LARGE_MESSAGE)

    expect(
      getErrorMessage(
        {
          status: 400,
          data: { message: 'request entity too large' },
        },
        'Unable to save employee.',
      ),
    ).toBe(IMAGE_TOO_LARGE_MESSAGE)

    expect(
      getErrorMessage(
        {
          status: 'PARSING_ERROR',
          originalStatus: 413,
          data: 'Payload Too Large',
          error: 'Unexpected token',
        },
        'Unable to save employee.',
      ),
    ).toBe(IMAGE_TOO_LARGE_MESSAGE)
  })
})
