describe('requestSocialLogin', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
    jest.restoreAllMocks();
  });

  test('adds local redirect type when kakao redirect uri is localhost', async () => {
    process.env.NEXT_PUBLIC_API_BASE_URL = 'https://api.kkium.com';
    process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI =
      'http://localhost:3000/oauth/kakao/callback';

    const fetchMock = jest.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          status: 200,
          code: 'SUCCESS',
          message: 'OK',
          data: {
            accessToken: 'access-token',
          },
        }),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
          },
        },
      ),
    );
    global.fetch = fetchMock;

    const { requestSocialLogin } = await import('./authFetch');

    await requestSocialLogin('kakao', 'authorization-code');

    const requestUrl = new URL(fetchMock.mock.calls[0][0]);

    expect(requestUrl.searchParams.get('redirectType')).toBe('LOCAL');
  });
});
