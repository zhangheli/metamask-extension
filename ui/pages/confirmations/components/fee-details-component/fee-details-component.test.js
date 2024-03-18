import React from 'react';
import { screen, act } from '@testing-library/react';
import configureStore from 'redux-mock-store';
import { CHAIN_IDS } from '../../../../../shared/constants/network';
import mockState from '../../../../../test/data/mock-state.json';
import { renderWithProvider } from '../../../../../test/lib/render-helpers';
import FeeDetailsComponent from './fee-details-component';

jest.mock('../../../../store/actions', () => ({
  getGasFeeEstimatesAndStartPolling: jest
    .fn()
    .mockImplementation(() => Promise.resolve()),
  addPollingTokenToAppState: jest.fn(),
}));

const render = (state = {}) => {
  const store = configureStore()({ ...mockState, ...state });
  return renderWithProvider(<FeeDetailsComponent />, store);
};

describe('FeeDetailsComponent', () => {
  it('renders "Fee details"', async () => {
    await render({
      ...mockState,
      metamask: {
        ...mockState.metamask,
        providerConfig: {
          chainId: CHAIN_IDS.OPTIMISM,
        },
      },
    });
    expect(screen.queryByText('Fee details')).toBeInTheDocument();
  });

  it('should expand when button is clicked', async () => {
    await render({
      ...mockState,
      metamask: {
        ...mockState.metamask,
        providerConfig: {
          chainId: CHAIN_IDS.OPTIMISM,
        },
      },
    });
    expect(screen.queryByTitle('0 ETH')).not.toBeInTheDocument();
    await act(async () => {
      screen.getByRole('button').click();
    });
    expect(screen.getAllByTitle('0 ETH')).toHaveLength(2);
    expect(screen.getAllByTitle('0 ETH')[0]).toBeInTheDocument();
  });

  it('should be displayed for layer 2 network', async () => {
    await render({
      ...mockState,
      metamask: {
        ...mockState.metamask,
        networkDetails: {
          EIPS: {
            1559: false,
          },
        },
        networksMetadata: {
          goerli: {
            EIPS: {
              1559: false,
            },
            status: 'available',
          },
        },
        providerConfig: {
          chainId: CHAIN_IDS.OPTIMISM,
        },
      },
    });
    expect(screen.queryByText('Fee details')).toBeInTheDocument();
  });
});
