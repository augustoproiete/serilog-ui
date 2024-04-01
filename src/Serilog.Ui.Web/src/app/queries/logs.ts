import dayjs from 'dayjs';
import { type SearchForm, type SearchResult } from '../../types/types';
import { isDefinedGuard, isStringGuard } from '../util/guards';
import {
  determineHost,
  send403Notification,
  sendUnexpectedNotification,
} from '../util/queries';

const defaultReturn = {
  count: 0,
  currentPage: 1,
  logs: [],
  total: 0,
};

export const fetchLogs = async (
  values: SearchForm,
  fetchOptions: RequestInit,
  routePrefix?: string,
): Promise<SearchResult> => {
  const prepareUrl = prepareSearchUrl(values, routePrefix);
  if (!prepareUrl.areDatesAdmitted) return defaultReturn;

  try {
    const req = await fetch(prepareUrl.url, fetchOptions);

    if (req.ok) return await (req.json() as Promise<SearchResult>);

    return await Promise.reject({ code: req.status, message: 'Failed to fetch' });
  } catch (error: unknown) {
    const err = error as Error & { code?: number; message?: string };
    err?.code === 403 ? send403Notification() : sendUnexpectedNotification(err.message);

    return defaultReturn;
  }
};

const prepareSearchUrl = (input: SearchForm, routePrefix?: string) => {
  const { entriesPerPage: count, page, table: key, ...inputData } = { ...input };

  const startDate = inputData.startDate;
  const endDate = inputData.endDate;
  if (
    isDefinedGuard(startDate) &&
    isDefinedGuard(endDate) &&
    dayjs(startDate).isAfter(dayjs(endDate))
  ) {
    sendUnexpectedNotification(
      'Start date cannot be greater than end date',
      'Invalid data',
      'yellow',
    );

    return { areDatesAdmitted: false, url: '' };
  }

  const url = `${determineHost(routePrefix)}/api/logs?page=${page}&count=${count}`;

  const startAsString = startDate?.toISOString() ?? '';
  inputData['startDate'] = startAsString as unknown as Date;
  const endAsString = endDate?.toISOString() ?? '';
  inputData['endDate'] = endAsString as unknown as Date;
  inputData['key'] = key;

  const urlWithOptionalParams = Object.keys(inputData).reduce(
    (prev, curr) => `${prev}${queryParamIfSet(curr, inputData[curr])}`,
    url,
  );

  return { areDatesAdmitted: true, url: urlWithOptionalParams };
};

const queryParamIfSet = (paramName: string, paramValue?: string | null) =>
  isDefinedGuard(paramValue) && isStringGuard(paramValue)
    ? `&${paramName}=${paramValue}`
    : '';
