import { RateLimiter } from '../utils/rateLimiter';
import { GeneralInfoAPI } from './info/general';
import { SpotInfoAPI } from './info/spot';
import { PerpetualsInfoAPI } from './info/perpetuals';
import { HttpApi } from '../utils/helpers';
import { SymbolConversion } from '../utils/symbolConversion';

import {
  AllMids,
  UserOpenOrders,
  FrontendOpenOrders,
  UserFills,
  UserRateLimit,
  OrderStatus,
  L2Book,
  CandleSnapshot,
  ReferralStateResponse,
  UserFees,
  UserPortfolio,
  TokenDetails,
  BuilderFeeResponse,
} from '../types/index';

import { InfoType, ENDPOINTS } from '../types/constants';

export class InfoAPI {
  public spot: SpotInfoAPI;
  public perpetuals: PerpetualsInfoAPI;
  private httpApi: HttpApi;
  private generalAPI: GeneralInfoAPI;
  private symbolConversion: SymbolConversion;

  constructor(
    baseURL: string,
    rateLimiter: RateLimiter,
    symbolConversion: SymbolConversion,
  ) {
    this.httpApi = new HttpApi(baseURL, ENDPOINTS.INFO, rateLimiter);
    this.symbolConversion = symbolConversion;

    this.generalAPI = new GeneralInfoAPI(this.httpApi, this.symbolConversion);
    this.spot = new SpotInfoAPI(this.httpApi, this.symbolConversion);
    this.perpetuals = new PerpetualsInfoAPI(
      this.httpApi,
      this.symbolConversion,
    );
  }

  async getAssetIndex(assetName: string): Promise<number | undefined> {
    return await this.symbolConversion.getAssetIndex(assetName);
  }

  async getInternalName(exchangeName: string): Promise<string | undefined> {
    return await this.symbolConversion.convertSymbol(exchangeName);
  }

  async getAllAssets(): Promise<{ perp: string[]; spot: string[] }> {
    return await this.symbolConversion.getAllAssets();
  }

  async getAllMids(): Promise<AllMids> {
    return this.generalAPI.getAllMids();
  }

  async getTokenDetails(tokenId: string): Promise<TokenDetails> {
    return this.generalAPI.getTokenDetails(tokenId);
  }

  async getReferralState(
    userPublicKey: string,
  ): Promise<ReferralStateResponse> {
    return this.generalAPI.getReferralState(userPublicKey);
  }

  async getMaximumBuilderFee(
    userPublicKey: string,
    builderPublicKey: string,
  ): Promise<BuilderFeeResponse> {
    return this.generalAPI.getMaximumBuilderFee(
      userPublicKey,
      builderPublicKey,
    );
  }

  async getUserOpenOrders(
    user: string,
    rawResponse: boolean = false,
  ): Promise<UserOpenOrders> {
    return this.generalAPI.getUserOpenOrders(user, rawResponse);
  }

  async getFrontendOpenOrders(
    user: string,
    rawResponse: boolean = false,
  ): Promise<FrontendOpenOrders> {
    return this.generalAPI.getFrontendOpenOrders(user, rawResponse);
  }

  async getUserFills(
    user: string,
    rawResponse: boolean = false,
  ): Promise<UserFills> {
    return this.generalAPI.getUserFills(user, rawResponse);
  }

  async getUserFillsByTime(
    user: string,
    startTime: number,
    endTime: number,
    rawResponse: boolean = false,
  ): Promise<UserFills> {
    return this.generalAPI.getUserFillsByTime(
      user,
      startTime,
      endTime,
      rawResponse,
    );
  }

  async getUserRateLimit(
    user: string,
    rawResponse: boolean = false,
  ): Promise<UserRateLimit> {
    return this.generalAPI.getUserRateLimit(user, rawResponse);
  }

  async getOrderStatus(
    user: string,
    oid: number | string,
    rawResponse: boolean = false,
  ): Promise<OrderStatus> {
    return this.generalAPI.getOrderStatus(user, oid, rawResponse);
  }

  async getUserFees(userPublicKey: string): Promise<UserFees> {
    return this.generalAPI.getUserFees(userPublicKey);
  }

  async getUserPortfolio(userPublicKey: string): Promise<UserPortfolio> {
    return this.generalAPI.getUserPortfolio(userPublicKey);
  }

  async getL2Book(coin: string, rawResponse: boolean = false): Promise<L2Book> {
    return this.generalAPI.getL2Book(coin, rawResponse);
  }

  async getCandleSnapshot(
    coin: string,
    interval: string,
    startTime: number,
    endTime: number,
  ): Promise<CandleSnapshot[]> {
    return this.generalAPI.getCandleSnapshot(
      coin,
      interval,
      startTime,
      endTime,
    );
  }
}
