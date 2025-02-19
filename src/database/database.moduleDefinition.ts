import { ConfigurableModuleBuilder } from "@nestjs/common";

export const { ConfigurableModuleClass: ConfigurableDatabaseModule } =
	new ConfigurableModuleBuilder().setClassMethodName("forRoot").build();
