export const remoteFOrmReturnWithSuccess = (success: boolean, message: string) => {
	return {
		success,
		message
	};
};

export type RemoteFormEnhanceParams<T extends (...args: any[]) => any> = Parameters<
	Parameters<T>[0]
>[0];
