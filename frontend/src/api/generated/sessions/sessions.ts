import type {
  DashboardSummaryResponse,
  GetSessionsParams,
  SessionCreate,
  SessionListResponse,
  SessionReportResponse,
  SessionResponse,
  TestPresetResponse,
} from '../models';
import { customInstance } from '../../http/axios';

type SecondParameter<T extends (...args: never) => unknown> = Parameters<T>[1];

export const get_dashboard_summary = (
  options?: SecondParameter<typeof customInstance<DashboardSummaryResponse>>,
) => {
  return customInstance<DashboardSummaryResponse>(
    { url: `/api/v1/dashboard/summary`, method: 'GET' },
    options,
  );
};

export const get_test_presets = (
  options?: SecondParameter<typeof customInstance<TestPresetResponse[]>>,
) => {
  return customInstance<TestPresetResponse[]>({ url: `/api/v1/presets`, method: 'GET' }, options);
};

export const get_sessions = (
  params?: GetSessionsParams,
  options?: SecondParameter<typeof customInstance<SessionListResponse>>,
) => {
  return customInstance<SessionListResponse>(
    { url: `/api/v1/sessions`, method: 'GET', params },
    options,
  );
};

export const create_session = (
  body: SessionCreate,
  options?: SecondParameter<typeof customInstance<SessionResponse>>,
) => {
  return customInstance<SessionResponse>(
    {
      url: `/api/v1/sessions`,
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      data: body,
    },
    options,
  );
};

export const get_session_by_id = (
  sessionId: string,
  options?: SecondParameter<typeof customInstance<SessionResponse>>,
) => {
  return customInstance<SessionResponse>(
    { url: `/api/v1/sessions/${sessionId}`, method: 'GET' },
    options,
  );
};

export const get_session_report = (
  sessionId: string,
  options?: SecondParameter<typeof customInstance<SessionReportResponse>>,
) => {
  return customInstance<SessionReportResponse>(
    { url: `/api/v1/sessions/${sessionId}/report`, method: 'GET' },
    options,
  );
};
